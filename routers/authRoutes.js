import { Router } from "express";
const router = Router();

import { getRegisterPage, postRegister, getLoginPage, postLogin, isUserLoginResponse } from "../controllers/authController.js";
// to cline this routers page we can use this controllers 

router.get('/register', getRegisterPage);
router.post('/register', postRegister);

// router.get('/login', getLoginPage);   ////
// router.post('/login', postLogin);     //// instead of this two line we can write this : -
router.route('/login').get(getLoginPage).post(postLogin);

router.get('/login/isUserLogin', isUserLoginResponse);



export const authRoutes = router;

