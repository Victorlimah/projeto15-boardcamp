import { Router } from "express";
import { createCustomerMiddleware, putCustomerMiddleware } from "../middlewares/customerMiddleware.js";
import { getCustomers, getCustomer, createCustomer, putCustomer } from "../controllers/customerController.js";

const customersRouter = Router();

customersRouter.get("/customers", getCustomers);
customersRouter.get("/customers/:id", getCustomer);
customersRouter.put("/customers/:id", putCustomerMiddleware, putCustomer);
customersRouter.post("/customers", createCustomerMiddleware, createCustomer);

export default customersRouter;