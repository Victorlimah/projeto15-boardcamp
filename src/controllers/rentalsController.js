import { connection } from "../data/db.js";

export async function getRentals(_req, res) {
  try {
    res.send(res.locals.rentals);
  } catch (err) {
    res.status(500).send({ message: "Error getting rentals", error: err });
  }
}

export async function createRental(req, res){
  try{
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

    res.status(201).send({ message: "Rental created successfully" });
  } catch (err){
    res.status(500).send({ message: "Error creating rental", error: err });
  }
}

export async function finallateRental(req, res){
  try{
    const { id } = req.params;

    const rental = await connection.query(`SELECT * FROM rentals WHERE id=$1`, [id]);
    if(rental.rowCount === 0)
      return res.status(404).send({ message: "Rental not found"});

    const { returnDate, rentDate, daysRented, originalPrice } = rental.rows[0];

    if(returnDate)
      return res.status(400).send({ message: "Rental already returned"});

    const date = new Date();
    const daysFinal = date.getDate() - rentDate.getDate();
    let delayFee = 0;

    if(daysFinal > daysRented)
      delayFee = (daysFinal - daysRented) * originalPrice;
    
    await connection.query(`
      UPDATE rentals SET "returnDate"=$1, "delayFee"=$2  WHERE id=$3`, [date, delayFee, id]);

   res.status(200).send({ message: "Rental finalized successfully" });
  } catch (err){
    res.status(500).send({ message: "Error finalizing rental", error: err });
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

