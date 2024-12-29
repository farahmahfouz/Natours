const AppError = require('../Utils/app.error');

const handleCastErrorDB = (err) => {
  const message = `Invalid${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  // const value = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${errors.join(
    '. '
  )}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    error: err,
    message: err.message,
    // stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR🐞', err);
    res.status(500).send({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

const handleJWTerror = () =>
  new AppError('Invalid Token, Please login again!', 401);

const handleExpireError = () =>
  new AppError('Your Token has expired, Please login again!', 401);

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;
    error.name = err.name;

    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);
    sendErrorProduction(error, res);
    if (error.name === 'JsonWebTokenError') error = handleJWTerror();
    if (error.name === 'TokenExpiredError') error = handleExpireError();
  }
};
