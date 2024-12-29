const { Router } = require('express');
const {
  getAllUsers,
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateUser,
  deleteUser,
  getOneUser,
  getMe
} = require('../controllers/usersController.js');
const { auth, restrictTo } = require('../middlewares/auth.js');
const router = Router();

router.get('/me', auth , getMe, getOneUser)

router.post('/signup', signup);

router.post('/login', login);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', auth, updatePassword);

router.patch('/updateUser', auth, updateUser);

router.delete('/deleteUser', auth, deleteUser);

router.get('/', getAllUsers);

router.get('/:id', getOneUser);

// router.patch('/:id', updateUser)

module.exports = router;
