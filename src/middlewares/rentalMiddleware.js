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