

export const getCountryApp = (req, res) => {
    // const isLogin = Boolean(req.cookies.isLogin);  /// ⭐ receive cookies values 
    // we can use req.user from verifyMiddleware 
    if(req.user){
        res.render('countyApp');
    }else{
        res.redirect('/login');
    }
}


