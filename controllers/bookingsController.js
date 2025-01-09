const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Tour = require('../Models/tourModel');
const catchAsync = require('../Utils/catchAsync.js');
const AppError = require('../Utils/app.error.js');
const factory = require('../Utils/handlerFactory.js');

exports.getCheckoutSession = catchAsync(async (req, res, next) => {
  //Get The Currently booked tour
  const tour = await Tour.findById(req.params.tourId);

  const lineItems = [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: `${tour.name} Tour`,
          description: tour.summary,
          images: [
            `https://www.natours.dev/img/tours/${tour.imageCover}`,
          ],
        },
        unit_amount: tour.price * 100,
      },
      quantity: 1,
    },
  ];

  //Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/`,
    cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourId,
    line_items: lineItems
  });
  //Create session as response
  res.status(200).json({
    status: 'success',
    session,
    lineItems
  });
});
