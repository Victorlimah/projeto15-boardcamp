import { Router } from "express";
import { getCustomers } from "../controllers/customerController.js";

const custumersRouter = Router();

custumersRouter.get("/customers", getCustomers);

export default custumersRouter;