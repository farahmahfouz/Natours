const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const mongoose = require('mongoose');
const AppError = require('./Utils/app.error.js');
const globalErrorMiddleware = require('./middlewares/global-errors.js');
require('dotenv').config();

const app = express();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

/// Import routes
const toursRoute = require('./routes/toursRoute.js');
const usersRoute = require('./routes/usersRoute.js');
const reviewRoute = require('./routes/reviewsRoute.js')

/// Middelwares
app.use(helmet());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

app.use(express.json());

app.use(mongoSanitize());
app.use(xss());
app.use(
  hpp({
    whitelist: ['duration', 'maxGroupSize', 'ratingsAverage', 'ratingsQuantity', 'difficulty', 'price'],
  })
);

app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req.headers)
  next();
});

/// Routes
app.use('/api/v1/tours', toursRoute);
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/reviews', reviewRoute);

// Not Found routes
app.all('*', (req, res, next) => {
  const err = new AppError(`Can't find ${req.originalUrl} on this server!`);
  next(err);
});

app.use(globalErrorMiddleware);

/// Running Server and connect with DB
mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log('Connected to MongoDB Server');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} ...`);
    });
  })
  .catch((err) => {
    console.log('Faild to connect to MongoDB', err);
  });

// process.on('unhandledRejection', (err) => {
//   console.log('UNHANDLED REJECTION! 💥 Shutting down...');
//   console.log(err.name, err.message);
//   server.close(() => {
//     process.exit(1);
//   });
// });
