import { Router } from "express";
import categoryRouter from "./categoryRouter.js";
import gamesRouter from "./gamesRouter.js";

const router = Router();

router.use(categoryRouter);
router.use(gamesRouter);

export default router;
