import { connection } from "../data/db.js";

export async function getCategories(_req, res) {
  try {
    res.send(res.locals.categories);
  } catch (err) {
    res.status(500).send({ message: "Error getting categories", error: err });
  }
}

export async function createCategory(req, res) {
  try {
    await connection.query("INSERT INTO categories (name) VALUES ($1)", [req.body.name]);  
    res.status(201).send({ message: "Category created" });

  } catch (err) {
    res.status(500).send({ message: "Error creating category", error: err });
  }
}
