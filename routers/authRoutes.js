import { Router } from "express";
const router = Router();

import {
    getRegisterPage, postRegister,
    getLoginPage, postLogin, isUserLoginResponse, logoutUser,
    verifyEmailPage, resendVerificationLink,
    verifyVerificationCode,
} from "../controllers/authController.js";
// to cline this routers page we can use this controllers 

router.get('/register', getRegisterPage);
router.post('/register', postRegister);

// router.get('/login', getLoginPage);   ////
// router.post('/login', postLogin);     //// instead of this two line we can write this : -
router.route('/login').get(getLoginPage).post(postLogin);

router.get('/login/isUserLogin', isUserLoginResponse);

router.get('/logout', logoutUser);

router.get('/verify-email', verifyEmailPage);

router.route('/resend-verification-link').post(resendVerificationLink);  /// this can send email with verificationLink and code 

router.route('/verify-email-token').get(verifyVerificationCode); // this can check user mail token is valid or not 

export const authRoutes = router;

