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

     await connection.query(
       `INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay")
          VALUES($1, $2, $3, $4, $5)`,
       [name, image, stockTotal, categoryId, pricePerDay]
     );

     res.locals.message = { message: "Game created" };

    next();
  } catch (err) {
    res.status(500).send({ message: "Error creating game", error: err });
  }
}

export async function getGameMiddleware(req, res, next) {
  const { orderBy, orderDir } = res.locals;
  try {
    let name = req.query.name;
    if (!name) name = "";

    const games = await connection.query(`
      SELECT
        games.*, categories.name AS "categoryName"
      FROM games
        JOIN categories ON games."categoryId" = categories.id
      WHERE
        games.name ILIKE $1
      ORDER BY ${orderBy} ${orderDir}
    `, [`%${name}%`]);

   res.locals.games = games.rows;
    next();
  } catch (err) {
    res.status(500).send({ message: "Error getting games", error: err });
  }
}