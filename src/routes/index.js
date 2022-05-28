import { Router } from "express";
import gamesRouter from "./gamesRouter.js";
import rentalsRouter from "./rentalsRouter.js";
import categoryRouter from "./categoryRouter.js";
import customersRouter from "./customersRouter.js";

const router = Router();

router.use(gamesRouter);
router.use(rentalsRouter)
router.use(categoryRouter);
router.use(customersRouter);

export default router;
