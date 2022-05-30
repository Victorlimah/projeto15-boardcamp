import { Router } from "express";
import { createCategoryMiddleware } from "../middlewares/categoryMiddleware.js";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", createCategoryMiddleware, createCategory);

export default categoriesRouter;
