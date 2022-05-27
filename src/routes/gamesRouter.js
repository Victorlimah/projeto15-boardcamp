import { Router } from "express";
import { createGame, getGames } from "../controllers/gameController.js";

const gamesRouter = Router();

gamesRouter.get("/games", getGames);
gamesRouter.post("/games", createGame);

export default gamesRouter;