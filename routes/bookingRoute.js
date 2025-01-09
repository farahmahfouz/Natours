const { Router } = require('express');
const { getCheckoutSession } = require('../controllers/bookingsController.js');
const { auth, restrictTo } = require('../middlewares/auth.js');
const router = Router({ mergeParams: true });

router.get('/checkout-session/:tourId', auth, getCheckoutSession);

module.exports = router;
