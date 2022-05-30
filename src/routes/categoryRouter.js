import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { createCategoryMiddleware, getCategoriesMiddleware } from "../middlewares/categoryMiddleware.js";
import { orderAndDesc, paginate } from "../middlewares/utils.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", orderAndDesc, paginate, getCategoriesMiddleware, getCategories);
categoriesRouter.post("/categories", createCategoryMiddleware, createCategory);

export default categoriesRouter;
