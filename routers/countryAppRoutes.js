import { Router } from "express";
const router = Router();
import { getCountryApp, postCountrySave, postFavoriteStatus, getFavoriteCounters, deleteFavoriteCountry } from "../controllers/countryAppController.js";

router.get('/countryapp', getCountryApp);
router.post('/countryapp/savecountry', postCountrySave);
router.post('/countryapp/favoritestatus', postFavoriteStatus);
router.delete('/countryapp/deletecountry', deleteFavoriteCountry);

router.get('/countryapp/favoritecounters', getFavoriteCounters);

export const countryAppRoutes = router;



