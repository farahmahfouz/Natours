const User = require('../Models/userModel.js');
const AppError = require('../Utils/app.error.js');
const catchAsync = require('../Utils/catchAsync.js');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');

exports.auth = catchAsync(async (req, res, next) => {
  //1) Check if tken exists
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  
  if (!token) {
    return next(
      new AppError('You are not logged in! Please login to get access', 401)
    );
  }
  //2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //3) Check if user still exists
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError('No user exist with this token', 401));
  }
  // 4) Check if users changes password after the token was issued
  if (user.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    );
  }
  req.user = user;
  next();
});

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
