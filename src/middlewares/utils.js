export function orderAndDesc(req, res, next) {
    const { order, desc} = req.query;

    const orderBy = order ? order : "id";
    const orderDir = desc ? "DESC" : "ASC";

    res.locals.orderBy = orderBy;
    res.locals.orderDir = orderDir;

    next();
}

export function rentalsFactory(row) {
  const [
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customerName,
    gameName,
    categoryId,
    categoryName,
  ] = row;

  return {
    id,
    customerId,
    gameId,
    rentDate,
    daysRented,
    returnDate,
    originalPrice,
    delayFee,
    customer: {
      id: customerId,
      name: customerName,
    },
    game: {
      id: gameId,
      name: gameName,
      categoryId,
      categoryName,
    },
  };
}

export function paginate(req, res, next) {
  let { offset, limit } = req.query;

  if (!offset) offset = 0;

  let query = `offset ${offset}`
  if (limit) query += ` limit ${Number(limit)}`;

  res.locals.paginate = query;
  next();
}