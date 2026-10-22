import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { sessionTable } from "../model/sessionSchema.js";
import { user } from "../model/userSchema.js";
import { setAuthCookies, clearAuthCookies } from "../lib/authCookie.js";
dotenv.config();


export const verifyAuthentication = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;
    req.user = null;
    req.sessionId = null;
    if (!accessToken && !refreshToken) { // if both are not available mean user logout or user not open WB for few days
        return next(); //req.user is null as it is 
    }
    if (accessToken) {
        try {
            const decodedToken = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
            req.user = decodedToken; // we use it to check is user login or not 
            req.sessionId = decodedToken.sessionId;
        } catch (error) {
            console.log('Access token expired or invalid'); //req.user is null as it is
        }
    }
    if (refreshToken) {
        try {
            const decodedToken = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
            // console.log(decodedToken); // we get sessionId
            const nowSession = await sessionTable.findOne({ _id: decodedToken.sessionId });
            if (!nowSession || !nowSession.valid) { // if we not get session or session.valid is false
                // the session is already deleted (logout / db reset) so the old cookie is useless
                // we remove it , otherwise this error come again and again on every request
                clearAuthCookies(res);
                console.log('Session not found, user need to login again');
                return next();
            }
            const userFromTable = await user.findOne({ _id: nowSession.user }); // using above session we get actual user from user table
            if (!userFromTable) {  // if userFromTable not found mean session.user is invalid
                clearAuthCookies(res);
                console.log('Session user not found, user need to login again');
                return next();
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

            setAuthCookies(res, nowAccessToken, newRefreshToken);

            req.user = userInfoForToken;  // now the user is login for this request also (accessToken was expired before)
            req.sessionId = nowSession._id;

        } catch (error) {
            clearAuthCookies(res);
            console.log('Refresh token invalid, user need to login again'); //req.user is null as it is
        }
    }

    return next();
} 
