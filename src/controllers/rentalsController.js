import { connection } from "../data/db.js";

export async function getRentals(_req, res) {
  try {
    res.send(res.locals.rentals);
  } catch (err) {
    res.status(500).send({ message: "Error getting rentals", error: err });
  }
}

export async function createRental(_req, res){
  try{
    res.status(201).send({ message: res.locals.message });
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

