const handleErrors = (err, _, res, next) => {
  const statusCode = err.statusCode || 500;
  const messageError = statusCode === 500 ? 'На сервере произошла ошибка' : err.message;
  res.status(statusCode).send({
    code: res.statusCode,
    status: err.name,
    message: messageError,
  });
  next();
};

module.exports = handleErrors;
