import { connection } from "../data/db.js";
import { customerSchema } from "../schemas/customerSchemas.js";

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

export async function createCustomer(req, res) {
  const { name, birthday, cpf, phone } = req.body;
  try {
    const validation = customerSchema.validate(req.body);
    if (validation.error)
      return res.status(400).send({ message: "Invalid customer", error: validation.error });

    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
    if (cpfExists.rowCount > 0)
      return res.status(409).send({ message: "Customer already exists" });

    await connection.query(
      `INSERT INTO customers(name, birthday, cpf, phone)
        VALUES($1, $2, $3, $4) RETURNING *`,
      [name, birthday, cpf, phone]
    );

    res.status(201).send({ message: "Customer created" });
  } catch (err) {
    res.status(500).send({ message: "Error creating customer", error: err });
  }
}
