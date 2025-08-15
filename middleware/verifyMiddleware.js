import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config();


export const verifyAuthentication = (req, res, next) => {
    const token = req.cookies.accessToken;
    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
            req.user = decodedToken; // we use it to check is user login or not 
        } catch (error) {
            req.user = null;
        }
    } else {
        req.user = null;
    }
    return next();
} 