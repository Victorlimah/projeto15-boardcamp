import { connection } from "../data/db.js";

export async function getCustomers(req, res) {
  try {
    let cpf = req.query.cpf;
    if (!cpf) cpf = "";

    const clientes = await connection.query(
      `SELECT * FROM customers WHERE cpf ILIKE $1`,
      [`${cpf}%`]
    );
    res.send(clientes.rows);
  } catch (err) {
    res.status(500).send({ message: "Error getting clientes", error: err });
  }
}
