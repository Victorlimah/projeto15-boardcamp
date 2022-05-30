import { Router } from "express";
import { createRental, deleteRental, finallateRental, getRentals } from "../controllers/rentalsController.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentals);
rentalsRouter.post("/rentals", createRental);
rentalsRouter.post("/rentals/:id/return", finallateRental );
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;