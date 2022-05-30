import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";
import { createCategoryMiddleware } from "../middlewares/categoryMiddleware.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", createCategoryMiddleware, createCategory);

export default categoriesRouter;
