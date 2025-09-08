import argon2 from 'argon2';
import jwt from "jsonwebtoken";
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config()
import { user } from "../model/userSchema.js";
import { sessionTable } from "../model/sessionSchema.js";
import { verifyEmailTable } from "../model/verifyEmailSchema.js";
import { sendEmail } from '../lib/nodemailer.js';

export const getRegisterPage = (req, res) => {  // after click : /register(get)   this function will run
   return res.render("auth/register");
}



export const postRegister = async (req, res) => {    // after click : /register(post)   this function will run
   const { name, email, password } = req.body;
   const result = await user.findOne({ email: email });  // search user by email 
   if (result) {   // if find it return object : true [mean user already exists]
      res.status(409).json({ success: false, message: "In this email user already exists...!" });
   } else {   // else return null: false [mean user not exists]
      const hashPW = await argon2.hash(password); // hash the PW and save in DB
      const data = {
         name: name,
         email: email,
         password: hashPW,
      }
      const newUser = await user.create(data);
      await afterRegisterLogin(newUser, req, res);
      // res.status(201).json({ success: true, massage: "User registration successful.....!" })
   }
}




export const getLoginPage = (req, res) => {   // after click : /login(get)   this function will run
   return res.render('auth/login');
}



export const postLogin = async (req, res) => {

   const { email, password } = req.body;
   const isUserExist = await user.findOne({ email: email });
   if (isUserExist) {
      const pwMatchOrNot = await argon2.verify(isUserExist.password, password);    // it can compare (dbHashedPW, userEnteredPW)
      if (pwMatchOrNot) {
         const { _id, name, email, isVerified } = isUserExist;

         /// now create sessions :
         const sessionObj = {
            user: _id,
            ip: req.clientIp,
            userAgent: req.headers["user-agent"],
         }
         const session = await sessionTable.create(sessionObj);
         /// now create accessToken or jwtToken
         const accessToken = jwt.sign({
            _id: _id,
            name: name,
            email: email,
            isVerified: isVerified,
            sessionId: session._id, // this above session id which we create
         }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

         /// now create refreshToken or jwtToken
         const refreshToken = jwt.sign({ sessionId: session._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '7d' }
         );

         res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
         //                                        basic information for security          15 minute
         res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
         //                                                                                 7day

         res.status(200).json({ success: true, massage: `Welcome ${isUserExist.name}` });
      }
      else { // password not matched
         res.status(401).json({ success: false, case: 'PWNM', massage: `Invalid user or password......` });
      }
   }
   else { // user not exist 
      res.status(404).json({ success: false, case: 'UNF', massage: `Invalid user or password......` });
   }
}





export const isUserLoginResponse = (req, res) => {
   // const isLogin = Boolean(req.cookies.isLogin);
   if (req.user) {
      res.json({ userLoginOrNot: true });
   } else {
      res.json({ userLoginOrNot: false });
   }
}



export const logoutUser = async (req, res) => {

   /// delete the session record from sessionTable using sessionId from req.user who is logged in 
   await sessionTable.deleteOne({ _id: req.user.sessionId });

   res.clearCookie("accessToken");
   res.clearCookie("refreshToken");

   res.redirect('/');
}







const afterRegisterLogin = async (newUser, req, res) => {
   const { _id, name, email, isVerified } = newUser;
   /// now create sessions :
   const sessionObj = {
      user: _id,
      ip: req.clientIp,
      userAgent: req.headers["user-agent"],
   }
   const session = await sessionTable.create(sessionObj);
   /// now create accessToken or jwtToken
   const accessToken = jwt.sign({
      _id: _id,
      name: name,
      email: email,
      isVerified: isVerified,
      sessionId: session._id, // this above session id which we create
   }, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });

   /// now create refreshToken or jwtToken
   const refreshToken = jwt.sign({ sessionId: session._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '7d' }
   );
   res.cookie("accessToken", accessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 })
   res.cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
   res.status(200).json({ success: true, message: `Welcome ${newUser.name} your registration successful.....!` });

}





export const verifyEmailPage = async (req, res) => {
   if (!req.user) return res.redirect('/login'); // if user not login 
   const userData = await user.findOne({ _id: req.user._id })
   if (!userData || userData.isVerified) return res.redirect('/'); // If the user not logged in OR the user already verified 
   res.render('auth/verifyEmailPage', { email: userData.email });
}

export const resendVerificationLink = async (req, res) => {
   if (!req.user) return res.redirect('/login'); // if user not login 
   const userData = await user.findOne({ _id: req.user._id })
   if (!userData || userData.isVerified) return res.redirect('/'); // If the user not logged in OR the user already verified 

   const token = generateVerifyTaken();

   await verifyEmailTable.deleteOne({ user: userData._id }); // because uer only verify with latest token so old token are deleted
   await verifyEmailTable.create({ user: userData._id, token: token }); // add token for user in DB

   const verifyLink = generateVerifyLink(userData.email, token);

   // send email for send verification email with token 
   sendEmail({   // this is an function with parameter define in ../lib/nodemailer.js
      to: userData.email,
      subject: 'Verify your email',
      html:
         `  <!DOCTYPE html>
         <html>
           <head>
             <meta charset="UTF-8">
             <title>Verify Your Email</title>
           </head>
           <body style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 20px; margin: 0;">
             <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; margin: auto; background: #ffffff; border-radius: 8px; padding: 20px;">
               <tr>
                 <td style="text-align: center;">
                   <h2 style="color: #333;">Email Verification</h2>
                   <p style="color: #555;">Click the button below to verify your email address:</p>
                   <a href="${verifyLink}" style="display: inline-block; padding: 10px 20px; background: #007bff; color: #fff; text-decoration: none; border-radius: 4px; margin: 15px 0;">
                     Verify Email
                   </a>
                   <p style="color: #555;">Or enter this code:</p>
                   <p style="font-size: 22px; font-weight: bold; color: #222; letter-spacing: 2px;">${token}</p>
                   <p style="font-size: 12px; color: #888;">This code expires in 24 hours.</p>
                 </td>
               </tr>
             </table>
           </body>
         </html>

      `
   }).catch(console.error);

   res.redirect('/verify-email');
}

const generateVerifyLink = (email, token) => {
   const url = new URL(`${process.env.FRONTEND_URL}/verify-email-token`);
   url.searchParams.append('token', token);
   url.searchParams.append('email', email);
   // console.log(url.href);
   return url.href;

}
const generateVerifyTaken = (digit = 8) => {
   const max = 10 ** digit;
   const min = 10 ** (digit - 1);  // it can generate 8 degit random code 
   return crypto.randomInt(min, max).toString();
}


export const verifyVerificationCode = async (req, res) => {
   if (!req.user) return res.redirect('/login'); // if user not login 
   const userData = await user.findOne({ _id: req.user._id })
   if (!userData || userData.isVerified) return res.redirect('/'); // If the user not logged in OR the user already verified 

   if (!req.query.email || !req.query.token) {
      return res.render('auth/afterVerifyPage', { verified: false });
   }

   const userExist = await user.findOne({ email: decodeURIComponent(req.query.email) })
   if (!userExist) {
      return res.render('auth/afterVerifyPage', { verified: false }); // mean in req.query.email is not exist any user
   }
   // if email or user is exist then 
   const userTokenData = await verifyEmailTable.findOne({ user: userExist._id }); // receive data from verifyEmailTable which is generated from 'resendVerificationLink' controller 
   if (userTokenData) {
      const { token, expireAt } = userTokenData;
      if (token === req.query.token && new Date() < expireAt) {
         await user.updateOne({ _id: userExist._id }, { isVerified: true });  // if token match then for this user isVerified = true 
         await verifyEmailTable.deleteOne({ user: userExist._id });
         return res.render('auth/afterVerifyPage', { verified: true });
      }
   }

   res.render('auth/afterVerifyPage', { verified: false });




}


