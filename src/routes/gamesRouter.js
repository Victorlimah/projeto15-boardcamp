import { Router } from "express";
import { getGames } from "../controllers/gameController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);

export default gamesRouter;