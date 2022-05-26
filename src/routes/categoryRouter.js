import { Router } from "express";
import { createCategory, getCategories } from "../controllers/categoryController.js";

const categoriesRouter = Router();

categoriesRouter.get("/categories", getCategories);
categoriesRouter.post("/categories", createCategory);

export default categoriesRouter;
