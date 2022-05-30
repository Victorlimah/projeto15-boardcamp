import { Router } from "express";
import { createRental, deleteRental, finallateRental, getRentals } from "../controllers/rentalsController.js";
import { getRentalsMiddleware } from "../middlewares/rentalMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentalsMiddleware , getRentals);
rentalsRouter.post("/rentals", createRental);
rentalsRouter.post("/rentals/:id/return", finallateRental );
rentalsRouter.delete("/rentals/:id", deleteRental);

export default rentalsRouter;