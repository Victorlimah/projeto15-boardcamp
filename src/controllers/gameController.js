import { connection } from "../data/db.js";
import { gameSchema } from "../schemas/gameSchemas.js";

export async function getGames(req, res) {
    try{
        let name = req.query.name;
        if(!name) name = "";

        const games = await connection.query(`
        SELECT games.*, categories.name AS "categoryName"
        FROM games JOIN categories ON games."categoryId" = categories.id        
        
        `);
        res.send(games.rows);
    } catch(err){
        res.status(500).send({ message: "Error getting games", error: err });
    }    
}

export async function createGame(req, res){
    try{
        const {name, image, stockTotal, categoryId, pricePerDay} = req.body;

        const validation = gameSchema.validate({name, image, stockTotal, categoryId, pricePerDay});
        if(validation.error)
            return res.status(400).send({ message: "Invalid game", error: validation.error });
        
        const categoryExists = await connection.query("SELECT * FROM categories WHERE id = $1", [categoryId]);
        if(categoryExists.rowCount === 0)
            return res.status(400).send({ message: "Category does not exist" });

        const gameExists = await connection.query("SELECT * FROM games WHERE name = $1", [name]);
        if(gameExists.rowCount > 0)
            return res.status(409).send({ message: "Game already exists" });

        await connection.query(
            `INSERT INTO games(name, image, "stockTotal", "categoryId", "pricePerDay")
            VALUES($1, $2, $3, $4, $5) RETURNING *`,
            [name, image, stockTotal, categoryId, pricePerDay]);

        res.status(201).send({message: "Game created"});
    } catch(err){
        res.status(500).send({ message: "Error creating game", error: err });
    }
}