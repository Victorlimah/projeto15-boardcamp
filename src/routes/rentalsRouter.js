import { Router } from "express";
import { createRental, deleteRental, finallateRental, getRentals } from "../controllers/rentalsController.js";
import { createRentalMiddleware, deleteRentalMiddleware,
finalizeRentalMiddleware, getRentalsMiddleware } from "../middlewares/rentalMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", getRentalsMiddleware , getRentals);
rentalsRouter.post("/rentals", createRentalMiddleware, createRental);
rentalsRouter.post("/rentals/:id/return", finalizeRentalMiddleware , finallateRental );
rentalsRouter.delete("/rentals/:id", deleteRentalMiddleware , deleteRental);

export default rentalsRouter;