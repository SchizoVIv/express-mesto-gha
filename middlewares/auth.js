const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  const bearer = 'Bearer ';
  const token = authorization.replace(bearer, '');

  if (!token) {
    return res.status(401).send({ message: 'Необходима авторизация' });
  }

  let payload;

  try {
    payload = jwt.verify(token, process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev_secret');
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).send({ message: 'Нет доступа' });
    }
    return res.status(500).send({ message: 'Ошибка сервера' });
  }

  console.log('есть доступ');
  req.user = payload;

  return next();
};

module.exports = { auth };
