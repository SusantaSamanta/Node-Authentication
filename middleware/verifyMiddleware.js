import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { sessionTable } from "../model/sessionSchema.js";
import { user } from "../model/userSchema.js";
dotenv.config();


export const verifyAuthentication = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    req.user = null;
    if (!accessToken && !refreshToken) { // if both are not available mean user logout or user not open WB for few days
        return next(); //req.user is null as it is 
    }
    if (accessToken) {
        try {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            req.user = decodedToken; // we use it to check is user login or not 
            
        } catch (error) {
            console.log(error); //req.user is null as it is
        }
    }
    if (refreshToken) {
        try {
            const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
            // console.log(decodedToken); // we get sessionId
            const nowSession = await sessionTable.findOne({ _id: decodedToken.sessionId });
            if (!nowSession || !nowSession.valid) { // if we not get session or session.valid is false
                throw new Error('Invalid session err');
            }
            const userFromTable = await user.findOne({ _id: nowSession.user }); // using above session we get actual user from user table
            if (!userFromTable) {  // if userFromTable not found mean session.user is invalid
                throw new Error("Invalid Session User");
            }

            const userInfoForToken = {
                _id: userFromTable._id,
                name: userFromTable.name,
                email: userFromTable.email,
                isVerified: userFromTable.isVerified,
                sessionId: nowSession._id,
            }
            /// now create accessToken or jwtToken
            const nowAccessToken = jwt.sign(userInfoForToken, process.env.JWT_SECRET_KEY, { expiresIn: '15m' });
            /// now create refreshToken or jwtToken
            const newRefreshToken = jwt.sign({ sessionId: nowSession._id }, process.env.JWT_SECRET_KEY, { expiresIn: '7d' });

            res.cookie("accessToken", nowAccessToken, { httpOnly: true, secure: true, maxAge: 15 * 60 * 1000 });
            res.cookie("refreshToken", newRefreshToken, { httpOnly: true, secure: true, maxAge: 7 * 24 * 60 * 60 * 1000 })


        } catch (error) {
            console.log('error',error); //req.user is null as it is
        }
    }

    
    

    return next();
} 