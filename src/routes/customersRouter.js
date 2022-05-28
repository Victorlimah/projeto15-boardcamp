import { Router } from "express";
import {
  getCustomers,
  getCustomer,
  createCustomer,
  putCustomer,
} from "../controllers/customerController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.post("/customers", createCustomer);
customersRouter.put("/customers/:id", putCustomer);

export default customersRouter;