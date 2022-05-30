import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { createCategoryMiddleware, getCategoriesMiddleware } from "../middlewares/categoryMiddleware.js";
import { orderAndDesc } from "../middlewares/utils.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", orderAndDesc , getCategoriesMiddleware , getCategories);
categoriesRouter.post("/categories", createCategoryMiddleware, createCategory);

export default categoriesRouter;
