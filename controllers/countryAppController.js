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
        const { name, flag, capital, continent, languages } = req.body;
        const nowUser = await user.findOne({ _id: req.user._id }); // retrieve all detail of user which login
        const favoriteCountryDetail = {
            name: name,
            flag: flag,
            capital: capital,
            continent: continent,
            languages: languages,
            user: nowUser._id, // save favorite county depending of userId who login
        }

        if (await countryTable.findOne({ name: name, user: nowUser._id })) { // if country already in db for this user 
            res.status(409).json({ success: false, massage: 'Country already added in favorite......!' });
        } else { // if country not in db
            await countryTable.create(favoriteCountryDetail);
            res.status(202).json({ success: true, massage: 'Country added to favorite......!' });
        }
    } else {
        res.redirect('/login');
    }
}


export const postFavoriteStatus = async (req, res) => {
    const nowUser = await user.findOne({ _id: req.user._id });
    if (req.user) {
        if (await countryTable.findOne({ name: req.body.countryName, user: nowUser._id }))
            return res.status(409).json({ success: true });
        return res.status(202).json({ success: false });

    } else {
        res.redirect('/login');
    }
}

export const getFavoriteCounters = async (req, res) => {
    if (req.user) {
        const nowUser = await user.findOne({ _id: req.user._id});
        const favorites = await countryTable.find({ user: nowUser })
        // console.log(favorites);
        res.render('favoriteCountryPage', { favorites });
    } else {
        res.redirect('/login');
    }
}

