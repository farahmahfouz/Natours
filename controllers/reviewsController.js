// const catchAsync = require('../Utils/catchAsync');
// const AppError = require('../Utils/app.error');
const Review = require('../Models/reviewModel.js');
const factory = require('../Utils/handlerFactory.js');


exports.setTourUsersIds = (req, res, next) => {
  //Allow nested routes
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllReviews = factory.getAll(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.getOneReview = factory.getOne(Review);
exports.deleteReview = factory.deleteOne(Review);
