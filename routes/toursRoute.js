const { Router } = require('express');
const router = Router();
const {
  aliasTopTours,
  createTour,
  getAllTours,
  getOneTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthPlan,
  getToursWithin,
  getDistances,
} = require('../controllers/toursController.js');
const reviewRouter = require('./reviewsRoute.js');
const { auth, restrictTo } = require('../middlewares/auth.js');

// router.param('id');

router.use('/:tourId/reviews', reviewRouter);

router.get('/top-5-tours', aliasTopTours, getAllTours);

router.get('/tour-stats', getTourStats);

router.get(
  '/monthly-plan/:year',
  auth,
  restrictTo('admin', 'lead-guide'),
  getMonthPlan
);

router.get('/tours-within/:distance/center/:latlng/unit/:unit', getToursWithin);

router.get('/distances/:latlng/unit/:unit', getDistances);

router.post('/', auth, restrictTo('admin', 'lead-guide', 'guide'), createTour);

router.get('/', getAllTours);

router.get('/:id', getOneTour);

router.patch('/:id', auth, restrictTo('admin', 'lead-guide'), updateTour);

router.delete('/:id', auth, restrictTo('admin', 'lead-guide'), deleteTour);

module.exports = router;
