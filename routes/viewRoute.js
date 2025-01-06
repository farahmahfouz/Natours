const { Router } = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
  getAccount,
  updateUserData,
} = require('../controllers/viewController.js');
const router = Router();
const { isLoggedIn, auth } = require('./../middlewares/auth.js');

router.get('/', isLoggedIn, getOverview);

router.get('/tour/:slug', isLoggedIn, getTour);

router.get('/login', isLoggedIn, getLoginForm);

router.get('/me', auth, getAccount);

router.post('/updateUser', auth, updateUserData);

module.exports = router;
