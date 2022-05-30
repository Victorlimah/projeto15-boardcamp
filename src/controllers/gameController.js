import { connection } from "../data/db.js";

export async function getGames(req, res) {
  try{
      let name = req.query.name;
      if(!name) name = "";

      const games = await connection.query(`
        SELECT
          games.*, categories.name AS "categoryName"
        FROM games
          JOIN categories ON games."categoryId" = categories.id
        WHERE games.name ILIKE $1
        `, [`${name}%`]);
      
      res.send(games.rows);
  } catch(err){
      res.status(500).send({ message: "Error getting games", error: err });
  }    
}

export async function createGame(req, res){
  try{
      const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

      await connection.query(
        `INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay")
          VALUES($1, $2, $3, $4, $5)`, [name, image, stockTotal, categoryId, pricePerDay]
      );

      res.status(201).send({message: "Game created"});
  } catch(err){
      res.status(500).send({ message: "Error creating game", error: err });
  }
}