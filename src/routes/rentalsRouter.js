import { Router } from "express";
import { createRental, deleteRental, getRentals } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", createRental);
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;