const jwt = require('jsonwebtoken');
const { UnauthorizedError } = require('../utils/errors');

const { JWT_SECRET, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const token = authorization.replace(bearer, '');

  if (!token) {
    throw new UnauthorizedError('Токен отсутствует');
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev_secret');
  } catch (error) {
    next(error);
  }

  req.user = payload;

  return next();
};

module.exports = { auth };
