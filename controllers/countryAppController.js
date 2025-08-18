import { countryTable } from "../model/countrySchema.js";
import { user } from "../model/userSchema.js";


export const getCountryApp = async (req, res) => {
    // const isLogin = Boolean(req.cookies.isLogin);  /// ⭐ receive cookies values 
    // we can use req.user from verifyMiddleware 
    if (req.user) {
        res.render('countyApp');
    } else {
        res.redirect('/login');
    }
}

export const postCountrySave = async (req, res) => {
    if (req.user) {
        const { name, details } = req.body;
        const nowUser = await user.findOne({ name: req.user.name }); // retrieve all detail of user which login
        const favoriteCountryDetail = {
            name: name,
            detail: details,
            user: nowUser._id, // save favorite county depending of userId who login
        }
        
        if (await countryTable.findOne({ name: name, user: nowUser._id })){ // if country already in db for this user 
            res.status(409).json({ success: false, massage: 'Country already added in favorite......!' });
        }else{ // if country not in db
            await countryTable.create(favoriteCountryDetail);
            res.status(202).json({ success: true, massage: 'Country added to favorite......!' });
        }
    } else {
        res.redirect('/login');
    }
}


