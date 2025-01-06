const User = require('../Models/userModel.js');
const AppError = require('../Utils/app.error.js');
const catchAsync = require('../Utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

// exports.logout = (req, res) => {
//   res.clearCookie('jwt');
//   res.status(200).json({ status: 'success' });
// };
exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

exports.auth = catchAsync(async (req, res, next) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(new AppError('Please log in to get access', 401));
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError('User no longer exists', 401));
  }

  if (user.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('Password recently changed. Please log in again', 401));
  }

  req.user = user;
  res.locals.user = user;

  next();
});

//Only for rendered pages, no errors!
exports.isLoggedIn = async (req, res, next) => {
  try {
    if (!req.cookies.jwt) {
      return next();
    }

    const decoded = await promisify(jwt.verify)(
      req.cookies.jwt,
      process.env.JWT_SECRET
    ).catch(() => null);
    console.log('Decoded token from isLogged In:', decoded);


    if (!decoded) {
      return next();
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return next();
    }

    if (user.changedPasswordAfter(decoded.iat)) {
      return next();
    }

    res.locals.user = user;
    return next();
  } catch (err) {
    return next();
  }
};

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You are not authorized to perform this action', 403)
      );
    }
    next();
  };
};
