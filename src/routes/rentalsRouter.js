import { Router } from "express";
import { orderAndDesc, paginate } from "../middlewares/utils.js";
import { createRental, deleteRental, finallateRental, getRentals } from "../controllers/rentalsController.js";
import { createRentalMiddleware, deleteRentalMiddleware,
finalizeRentalMiddleware, getRentalsMiddleware } from "../middlewares/rentalMiddleware.js";

const rentalsRouter = Router();

rentalsRouter.get("/rentals", orderAndDesc, paginate, getRentalsMiddleware, getRentals);
rentalsRouter.post("/rentals", createRentalMiddleware, createRental);
rentalsRouter.post("/rentals/:id/return", finalizeRentalMiddleware , finallateRental );
rentalsRouter.delete("/rentals/:id", deleteRentalMiddleware , deleteRental);

export default rentalsRouter;