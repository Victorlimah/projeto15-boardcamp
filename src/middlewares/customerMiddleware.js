import { connection } from "../data/db.js";
import { customerSchema } from "../schemas/customerSchemas.js";

export async function createCustomerMiddleware(req, res, next) {
  const { cpf } = req.body;
  try {
    const validation = customerSchema.validate(req.body);
    if (validation.error)
      return res.status(400).send({ message: "Invalid customer", error: validation.error });

    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
    if (cpfExists.rowCount > 0)
      return res.status(409).send({ message: "Customer already exists" });

    next();
  } catch (err) {
    res.status(500).send({ message: "Error creating customer", error: err });
  }
}

export async function putCustomerMiddleware(req, res, next) {
  try {
    const { id } = req.params;
    const { cpf } = req.body;
    const cliente = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);

    if (cliente.rows.length === 0)
      return res.status(404).send({ message: "Customer not found" });

    const validation = customerSchema.validate(req.body);
    if (validation.error)
      return res.status(400).send({ message: "Invalid customer", error: validation.error });

    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1 AND id != $2`, [cpf, id]);
    if (cpfExists.rowCount > 0)
      return res.status(409).send({ message: "Customer already exists" });

    next();
  } catch (err) {
    res.status(500).send({ message: "Error updating customer", error: err });
  }
}