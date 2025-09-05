import { Router } from "express";
import { user } from "../model/userSchema.js";
const router = Router();

router.get("/", (req, res) => {
    if (req.user) {
        res.render('userProfile');
    } else {
        res.redirect('/login');
    }
});

router.get("/userData", async (req, res) => {
    if (req.user) {
        const { name, email, isVerified} = await user.findOne({ _id: req.user._id });
        res.json({name, email, isVerified});
    } else {
        res.redirect('/login');
    }
});





export const profileRouter = router;