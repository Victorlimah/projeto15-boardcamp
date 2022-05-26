import { connection } from "../data/db.js";
import { categorySchema } from "./../schemas/categorySchemas.js";

export async function getCategories(_req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories");
    res.send(categories.rows);
  } catch (err) {
    res.status(500).send({ message: "Error getting categories", error: err });
  }
}

export async function createCategory(req, res) {
  try {
    const category = req.body.name;

    const validation = categorySchema.validate({ name: category });
    if (validation.error)
      return res.status(400).send({ message: "Invalid category", error: validation.error });

    const categoryExists = await connection.query("SELECT * FROM categories WHERE name = $1", [category]);
    if (categoryExists.rowCount > 0) 
        return res.status(409).send({ message: "Category already exists" });

    await connection.query("INSERT INTO categories (name) VALUES ($1)", [category]);  
    res.status(201).send({ message: "Category created" });

  } catch (err) {
    res.status(500).send({ message: "Error creating category", error: err });
  }
}
