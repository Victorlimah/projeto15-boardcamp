import { connection } from "../data/db.js";
import { categorySchema } from "./../schemas/categorySchemas.js";

export async function createCategoryMiddleware(req, res, next) {
  try {
    const category = req.body.name;

    const validation = categorySchema.validate({ name: category });
    if (validation.error)
      return res.status(400).send({ message: "Invalid category", error: validation.error });

    const categoryExists = await connection.query("SELECT * FROM categories WHERE name = $1", [category]);
    if (categoryExists.rowCount > 0)
      return res.status(409).send({ message: "Category already exists" });

    next();
  } catch (err) {
    res.status(500).send({ message: "Error creating category", error: err });
  }
}