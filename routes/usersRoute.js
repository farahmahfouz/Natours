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
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/usersController.js');
const { auth, restrictTo, logout } = require('../middlewares/auth.js');

const router = Router();

router.get('/me', auth, getMe, getOneUser);

router.post('/signup', signup);

router.post('/login', login);

router.get('/logout', logout);

router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);

router.patch('/updatePassword', auth, updatePassword);

router.patch('/updateUser', auth, uploadUserPhoto, resizeUserPhoto, updateUser);

router.delete('/deleteUser', auth, deleteUser);

router.get('/', getAllUsers);

router.get('/:id', getOneUser);

// router.patch('/:id', updateUser)

module.exports = router;
