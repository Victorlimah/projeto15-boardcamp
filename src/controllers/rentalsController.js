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

export async function finallateRental(_req, res){
  try{
   res.status(200).send({ message: "Rental finalized successfully" });
  } catch (err){
    res.status(500).send({ message: "Error finalizing rental", error: err });
  }
}

export async function deleteRental(_req, res){
 try{
    res.status(200).send({ message: "Rental deleted successfully" });
  } catch (err){
    res.status(500).send({ message: "Error deleting rental", error: err });
  }
}

