import dotenv from "dotenv";
dotenv.config();

/// cookie options are used for both set and clear, so the browser always match them and remove the cookie properly
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",   // in production only https , in dev it work on http://localhost and http://192.168.x.x also
    sameSite: "lax",
};

export const setAuthCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });        // 15 minute
    res.cookie("refreshToken", refreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 }); // 7 day
}

export const clearAuthCookies = (res) => {
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);
}
