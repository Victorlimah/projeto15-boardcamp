import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
} from "../controllers/customerController.js";

const custumersRouter = Router();

custumersRouter.get("/customers", getCustomers);
custumersRouter.get("/customers/:id", getCustomer);
custumersRouter.post("/customers", createCustomer);

export default custumersRouter;