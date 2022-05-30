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
    res.status(201).send({ message: "Rental created successfully" });
  } catch (err){
    res.status(500).send({ message: "Error creating rental", error: err });
  }
}

export async function finallateRental(req, res){
  try{
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

