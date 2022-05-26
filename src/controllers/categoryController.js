import { connection } from "../data/db.js";

export async function getCategories(_req, res) {
  try {
    const categories = await connection.query("SELECT * FROM categories");
    console.log(categories);
    res.send(categories.rows);
  } catch (err) {
    res.status(500).send({ message: "Error getting categories", error: err });
  }
}
