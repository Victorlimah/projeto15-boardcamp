import { connection } from "../data/db.js";
import { rentalsSchema } from "../schemas/rentalsSchemas.js";

export async function getRentalsMiddleware(req, res, next){
    const { customerId, gameId } = req.query;
    
    try {
        const params = [];
        const conditions = [];
        let where = "";
    
        if (customerId) {
        params.push(customerId);
        conditions.push(`rentals."customerId"=$${params.length}`);
        }
    
        if (gameId) {
        params.push(gameId);
        conditions.push(`rentals."gameId"=$${params.length}`);
        }
    
        if (params.length > 0) {
        where += `WHERE ${conditions.join(" AND ")}`;
        }
    
        const rentals = await connection.query({
            text: `
            SELECT 
            rentals.*,
            customers.name AS customer,
            games.name,
            categories.*
            FROM rentals
            JOIN customers ON customers.id=rentals."customerId"
            JOIN games ON games.id=rentals."gameId"
            JOIN categories ON categories.id=games."categoryId"
            ${where}
        `,
            rowMode: "array",
        }, params
        );
    
        res.locals.rentals = rentals.rows.map(rentalsFactory);
        next();
    } catch (err) {
        res.status(500).send({ message: "Error getting rentals", error: err });
    }
}

export async function createRentalMiddleware(req, res, next){
    try {
        const { customerId, gameId, daysRented } = req.body;

    const validation = rentalsSchema.validate(req.body);
    if(validation.error)
      return res.status(400).send({ message: "Invalid rental data", error: validation.error });

    const client = await connection.query(`SELECT * FROM customers WHERE id=${customerId}`);
    if(client.rowCount === 0)
      return res.status(400).send({ message: "Customer not found" });

    const game = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
    if (game.rowCount === 0)
      return res.status(400).send({ message: "Game not found" });

    const gameRented = await connection.query(`
      SELECT id FROM rentals WHERE "gameId"=$1 AND "returnDate" IS null `,[gameId]);

    if (gameRented.rowCount === game.rows[0].stockTotal)
    return res.status(400).send({ message: "Game not available" });
  
    const rentDate = new Date().toISOString().slice(0, 10);
    const originalPrice = game.rows[0].pricePerDay * daysRented;

    await connection.query(`
      INSERT INTO
        rentals("customerId", "gameId", "rentDate", "daysRented", "returnDate", "originalPrice", "delayFee")
      VALUES($1, $2, $3, $4, $5, $6, $7)
    `, [customerId, gameId, rentDate, daysRented, null, originalPrice, null]);

    res.locals.message = "Rental created successfully";
    next();
    } catch (err) {
        res.status(500).send({ message: "Error creating rental", error: err });
    }
}


function rentalsFactory(row) {
  const [
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customerName,
    gameName,
    categoryId,
    categoryName,
  ] = row;

  return {
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customer: {
      id: customerId,
      name: customerName,
    },
    game: {
      id: gameId,
      name: gameName,
      categoryId,
      categoryName,
    },
  };
}