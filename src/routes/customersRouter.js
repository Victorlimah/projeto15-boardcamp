import { Router } from "express";
import { createCustomerMiddleware, getCustomersMiddleware, getCustumerMiddleware, putCustomerMiddleware } from "../middlewares/customerMiddleware.js";
import { getCustomers, getCustomer, createCustomer, putCustomer } from "../controllers/customerController.js";
import { orderAndDesc, paginate } from "../middlewares/utils.js";

const customersRouter = Router();

customersRouter.get("/customers", orderAndDesc, paginate, getCustomersMiddleware, getCustomers);
customersRouter.get("/customers/:id", orderAndDesc, getCustumerMiddleware, getCustomer);
customersRouter.put("/customers/:id", putCustomerMiddleware, putCustomer);
customersRouter.post("/customers", createCustomerMiddleware, createCustomer);

export default customersRouter;