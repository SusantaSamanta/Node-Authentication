import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
    if(req.user){
        res.render('userProfile'); 
    }else{
        res.redirect('/login');
    }
});

router.get("/userData", (req, res) => {
    res.json(req.user);
});





export const profileRouter = router;