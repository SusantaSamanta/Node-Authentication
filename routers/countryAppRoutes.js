import { Router } from "express";
const router = Router();
import { getCountryApp, postCountrySave } from "../controllers/countryAppController.js";

router.get('/countryapp', getCountryApp);
router.post('/countryapp/savecountry', postCountrySave);

export const countryAppRoutes = router;