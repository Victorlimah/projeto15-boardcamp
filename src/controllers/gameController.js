
export async function getGames(_req, res) {
  try{
      res.send(res.locals.games);
  } catch(err){
      res.status(500).send({ message: "Error getting games", error: err });
  }    
}

export async function createGame(_req, res){
  try{
      res.status(201).send(res.locals.message);
  } catch(err){
      res.status(500).send({ message: "Error creating game", error: err });
  }
}