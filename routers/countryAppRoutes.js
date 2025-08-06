import { Router } from "express";
const router = Router();
import { getCountryApp } from "../controllers/countryAppController.js";

router.get('/countryapp', getCountryApp);

export const countryAppRoutes = router;