import { connection } from "../data/db.js";
//import { gameSchema } from "../schemas/categorySchemas.js";

export async function getGames(req, res) {
    try{
        let name = req.query.name;
        if(!name) name = "";

        const games = await connection.query("SELECT * FROM games WHERE name LIKE $1", [`${name}%`]);
        res.send(games.rows);
    } catch(err){
        res.status(500).send({ message: "Error getting games", error: err });
    }    
}