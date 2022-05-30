import { Router } from "express";
import { orderAndDesc } from "../middlewares/utils.js";
import { createGame, getGames } from "../controllers/gameController.js";
import { createGameMiddleware, getGameMiddleware } from "../middlewares/gameMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", orderAndDesc, getGameMiddleware, getGames);
gamesRouter.post("/games", createGameMiddleware, createGame);

export default gamesRouter;