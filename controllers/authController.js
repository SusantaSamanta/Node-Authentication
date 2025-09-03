import { user } from "../model/userSchema.js";
import argon2 from 'argon2';
import dotenv from 'dotenv';
dotenv.config()
import jwt from "jsonwebtoken";
import { sessionTable } from "../model/sessionSchema.js";



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
         const { _id, name, email } = isUserExist;

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
   /// now create sessions :
   const sessionObj = {
      user: newUser._id,
      ip: req.clientIp,
      userAgent: req.headers["user-agent"],
   }
   const session = await sessionTable.create(sessionObj);
   /// now create accessToken or jwtToken
   const accessToken = jwt.sign({
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
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