export const getCountryApp = (req, res) => {
    const isLogin = Boolean(req.cookies.isLogin);  /// ⭐ receive cookies values 
    if(isLogin == true){
        res.render('countyApp');
    }else{
        res.redirect('/login');
    }
}


