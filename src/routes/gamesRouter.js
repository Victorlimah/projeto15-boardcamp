import { Router } from "express";
import { orderAndDesc, paginate } from "../middlewares/utils.js";
import { createGame, getGames } from "../controllers/gameController.js";
import { createGameMiddleware, getGameMiddleware } from "../middlewares/gameMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", orderAndDesc, paginate, getGameMiddleware, getGames);
gamesRouter.post("/games", createGameMiddleware, createGame);

export default gamesRouter;