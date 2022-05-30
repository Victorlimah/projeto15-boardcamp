import { connection } from "../data/db.js";
import { gameSchema } from "../schemas/gameSchemas.js";

export async function createGameMiddleware(req, res, next) {
  const { name, image, stockTotal, categoryId, pricePerDay } = req.body;
  try {
    const validation = gameSchema.validate({ name, image, stockTotal, categoryId, pricePerDay });
    if (validation.error)
      return res.status(400).send({ message: "Invalid game", error: validation.error });

    const categoryExists = await connection.query("SELECT * FROM categories WHERE id = $1", [categoryId]);
    if (categoryExists.rowCount === 0)
      return res.status(400).send({ message: "Category does not exist" });

    const gameExists = await connection.query("SELECT * FROM games WHERE name = $1", [name]);
    if (gameExists.rowCount > 0)
      return res.status(409).send({ message: "Game already exists" });

    next();
  } catch (err) {
    res.status(500).send({ message: "Error creating game", error: err });
  }
}