import { user } from "../model/userSchema.js";
import argon2 from 'argon2';


export const getRegisterPage = (req, res) => {  // after click : /register(get)   this function will run
   return res.render("auth/register");
}



export const postRegister = async (req, res) => {    // after click : /register(post)   this function will run
   const { name, email, password } = req.body;
   const result = await user.findOne({ email: email });  // search user by email 
   if (result) {   // if find it return object : true [mean user already exists]
      res.status(409).json({ success: false, massage: "In this email user already exists...!" });
   } else {   // else return null: false [mean user not exists]
      const hashPW = await argon2.hash(password); // hash the PW and save in DB
      const data = {
         name: name,
         email: email,
         password: hashPW,
      }
      await user.create(data);
      res.status(201).json({ success: true, massage: "User registration successful.....!" })
   }
}



export const getLoginPage = (req, res) => {   // after click : /login(get)   this function will run
   return res.render('auth/login');
}



export const postLogin = async (req, res) => {     // after click : /login(POST)   this function will run
   //res.setHeader("set-cookie", "loginOrNot=true; path=/");    /// ⭐ set: cookies.   loginOrNot=true       path= {give the path for which cookies is available to access}
   //                                                                                       key  : value             where we can set '/' means every page access cookies.
   //          👆 this is old technique now we are use an middleWare call cookies parser
   // res.cookie("isLogin", true); /// this how we can set cookie and value, where path by default '/';


   // console.log(req.body);
   const { email, password } = req.body;
   const isUserExist = await user.findOne({ email: email });
   if (isUserExist) {
      // if (isUserExist.password == password) {
      const pwMatchOrNot = await argon2.verify(isUserExist.password, password);    // it can compare (dbHashedPW, userEnteredPW)
      if (pwMatchOrNot) {
         res.cookie("isLogin", true);
         res.status(200).json({ success: true, massage: `Welcome ${isUserExist.name}` });
      } else {
         res.status(401).json({ success: false, case: 'PWNM', massage: `Password not matched......` });
      }
   } else {
      res.status(404).json({ success: false, case: 'UNF', massage: `User not found please register first......` });
   }
}





export const isUserLoginResponse = (req, res) => {
   const isLogin = Boolean(req.cookies.isLogin);
   if (isLogin == true) {
      res.json({ userLoginOrNot: true });
   } else {
      res.json({ userLoginOrNot: false });
   }
}