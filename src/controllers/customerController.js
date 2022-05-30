export async function getCustomers(_req, res) {
  try {
    res.send(res.locals.customers);
  } catch (err) {
    res.status(500).send({ message: "Error getting customers", error: err });
  }
}

export async function getCustomer(_req, res) {
  try {
    res.send(res.locals.customer);
  } catch (err) {
    res.status(500).send({ message: "Error getting customer", error: err });
  }
}

export async function createCustomer(_req, res) {
  try {
    res.status(201).send(res.locals.message);
  } catch (err) {
    res.status(500).send({ message: "Error creating customer", error: err });
  }
}

export async function putCustomer(_req, res){
  try{
    res.status(200).send(res.locals.message);
  } catch (err){
    res.status(500).send({ message: "Error updating customer", error: err }); 
  }
}