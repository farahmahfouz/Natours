const { Router } = require('express');
const {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUsersIds,
  getOneReview,
} = require('../controllers/reviewsController.js');
const { auth, restrictTo } = require('../middlewares/auth.js');
const router = Router({ mergeParams: true });

router.use(auth);

router.get('/', getAllReviews);
router.post('/', restrictTo('user'), setTourUsersIds, createReview);
router.delete('/:id', restrictTo('user', 'admin'), deleteReview);
router.patch('/:id', restrictTo('user', 'admin'), updateReview);
router.get('/:id', getOneReview);
module.exports = router;
