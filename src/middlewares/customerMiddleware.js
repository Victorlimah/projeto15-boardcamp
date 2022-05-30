import { connection } from "../data/db.js";
import { customerSchema } from "../schemas/customerSchemas.js";

export async function createCustomerMiddleware(req, res, next) {
  const { name, birthday, cpf, phone } = req.body;
  try {
    const validation = customerSchema.validate(req.body);
    if (validation.error)
      return res.status(400).send({ message: "Invalid customer", error: validation.error });

    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1`, [cpf]);
    if (cpfExists.rowCount > 0)
      return res.status(409).send({ message: "Customer already exists" });

     await connection.query(
       `INSERT INTO 
        customers(name, birthday, cpf, phone)
      VALUES($1, $2, $3, $4)`,
       [name, birthday, cpf, phone]
     );

     res.locals.message = { message: "Customer created" }; 
     next();
  } catch (err) {
    res.status(500).send({ message: "Error creating customer", error: err });
  }
}

export async function putCustomerMiddleware(req, res, next) {
  try {
    const { id } = req.params;
    const { name, birthday, cpf, phone } = req.body;
    const cliente = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);

    if (cliente.rows.length === 0)
      return res.status(404).send({ message: "Customer not found" });

    const validation = customerSchema.validate(req.body);
    if (validation.error)
      return res.status(400).send({ message: "Invalid customer", error: validation.error });

    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1 AND id != $2`, [cpf, id]);
    if (cpfExists.rowCount > 0)
      return res.status(409).send({ message: "Customer already exists" });

    await connection.query(
      `UPDATE customers SET name = $1, birthday = $2, cpf = $3, phone = $4 WHERE id = $5`,
      [name, birthday, cpf, phone, id]
    );

    res.locals.message = { message: "Customer updated" };
    next();
  } catch (err) {
    res.status(500).send({ message: "Error updating customer", error: err });
  }
}

export async function getCustomersMiddleware(req, res, next) {
  try {
    const { orderBy, orderDir, paginate } = res.locals;
    let cpf = req.query.cpf;
    if (!cpf) cpf = "";

    const customers = await connection.query(`
    SELECT * FROM customers
    WHERE
      cpf ILIKE $1
    ORDER BY 
      ${orderBy} ${orderDir} ${paginate}`, [`${cpf}%`]);

    res.locals.customers = customers.rows;
    next();
  } catch (err) {
    res.status(500).send({ message: "Error getting customers", error: err });
  }
}

export async function getCustumerMiddleware(req, res, next) {
  try {
    const { orderBy, orderDir } = res.locals;
    const { id } = req.params;
    const customer = await connection.query(`
      SELECT * FROM customers WHERE id = $1 ORDER BY ${orderBy} ${orderDir}`, [id]);

    if (customer.rows.length === 0)
      return res.status(404).send({ message: "Customer not found" });

    res.locals.customer = customer.rows[0];
    next();
  } catch (err) {
    res.status(500).send({ message: "Error getting customer", error: err });
  }
}