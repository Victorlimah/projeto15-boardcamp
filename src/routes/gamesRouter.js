import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController.js";
import { createGameMiddleware } from "../middlewares/gameMiddleware.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", createGameMiddleware, createGame);

export default gamesRouter;