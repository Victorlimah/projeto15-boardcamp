import { Router } from "express";
import { getCustomers, createCustomer } from "../controllers/customerController.js";

const custumersRouter = Router();

custumersRouter.get("/customers", getCustomers);
custumersRouter.post("/customers", createCustomer);

export default custumersRouter;