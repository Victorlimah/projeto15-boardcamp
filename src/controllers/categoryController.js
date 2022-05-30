export async function getCategories(_req, res) {
  try {
    res.send(res.locals.categories);
  } catch (err) {
    res.status(500).send({ message: "Error getting categories", error: err });
  }
}

export async function createCategory(_req, res) {
  try {  
    res.status(201).send(res.locals.message);
  } catch (err) {
    res.status(500).send({ message: "Error creating category", error: err });
  }
}
