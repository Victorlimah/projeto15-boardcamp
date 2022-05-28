import { connection } from "../data/db.js";
import { rentalsSchema } from "../schemas/rentalsSchemas.js";

export async function getRentals(req, res) {
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

    res.send(rentals.rows.map(rentalsFactory));
  } catch (err) {
    res.status(500).send({ message: "Error getting rentals", error: err });
  }
}

export async function createRental(req, res){
  const { customerId, gameId, daysRented } = req.body;

  try{
    const validation = rentalsSchema.validate({ customerId, gameId, daysRented });
    if(validation.error)
      return res.status(400).send({ message: "Invalid rental data", error: validation.error });

    const rentDate = new Date().toISOString().slice(0, 10);
    const returnDate = null, delayFee = null;

    const client = await connection.query(`SELECT * FROM customers WHERE id=${customerId}`);
    if(client.rowCount === 0)
      return res.status(400).send({ message: "Customer not found" });

    const game = await connection.query(`SELECT * FROM games WHERE id=$1`, [gameId]);
    if (game.rowCount === 0)
      return res.status(400).send({ message: "Game not found" });
     
    const gameRented = await connection.query(`SELECT * FROM rentals WHERE gameId=$1`, [gameId]);
    if (gameRented.rowCount === game.rows[0].stockTotal)
    return res.status(400).send({ message: "Game not available" });
     
    const originalPrice = game.rows[0].pricePerDay * daysRented; 
    await connection.query(`
      INSERT 
        INTO rentals(customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee)
          VALUES($1, $2, $3, $4, $5, $6, $7)`,
      [customerId, gameId, rentDate, daysRented, returnDate, originalPrice, delayFee]
    );
   
    res.status(201).send({ message: "Rental created successfully" });

  } catch (err){
    res.status(500).send({ message: "Error creating rental", error: err });
  }
}

export async function deleteRental(req, res){
  const { id } = req.params;

  try{
    const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if(rental.rowCount === 0)
      return res.status(400).send({ message: "Rental not found" });

    await connection.query(`DELETE FROM rentals WHERE id=$1`, [id]);
    res.status(200).send({ message: "Rental deleted successfully" });

  } catch (err){
    res.status(500).send({ message: "Error deleting rental", error: err });
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
    rentDate: rentDate.toISOString().slice(0, 10),
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