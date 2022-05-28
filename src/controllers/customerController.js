import { connection } from "../data/db.js";
import { customerSchema } from "../schemas/customerSchemas.js";

export async function getCustomers(req, res) {
  try {
    let cpf = req.query.cpf;
    if (!cpf) cpf = "";

    let customers = await connection.query(`SELECT * FROM customers WHERE cpf ILIKE $1`, [`${cpf}%`]);
    customers.rows[0].birthday = customers.rows[0].birthday.toISOString().slice(0, 10);
    res.send(customers.rows);
  } catch (err) {
    res.status(500).send({ message: "Error getting customers", error: err });
  }
}

export async function getCustomer(req, res) {
  try {
    const { id } = req.params;
    let customer = await connection.query(`SELECT * FROM customers WHERE id = $1`,[id]);
    
    if (customer.rows.length === 0) 
    return res.status(404).send({ message: "Customer not found" });
    
    customer.rows[0].birthday = customer.rows[0].birthday.toISOString().slice(0, 10);
    res.send(customer.rows[0]);
  } catch (err) {
    res.status(500).send({ message: "Error getting customer", error: err });
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

export async function putCustomer(req, res){
  try{
    const { id } = req.params;
    const { name, birthday, cpf, phone } = req.body;
    const cliente = await connection.query(`SELECT * FROM customers WHERE id = $1`, [id]);

    if (cliente.rows.length === 0) 
      return res.status(404).send({ message: "Customer not found" });

    const validation = customerSchema.validate(req.body);
    if (validation.error)
      return res.status(400).send({ message: "Invalid customer", error: validation.error });

    const cpfExists = await connection.query(`SELECT * FROM customers WHERE cpf = $1 AND id != $2`, [cpf, id]);
    if (cpfExists.rowCount > 0 && cpfExists.rows[0].id !== id)
      return res.status(409).send({message: "CPF already exists"});

    await connection.query(
      `UPDATE customers SET name = $1, birthday = $2, cpf = $3, phone = $4 WHERE id = $5 RETURNING *`,
      [name, birthday, cpf, phone, id]
    );

    res.status(200).send({ message: "Customer updated" });
  } catch (err){
    res.status(500).send({ message: "Error updating customer", error: err }); 
  }
}