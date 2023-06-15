var express = require('express');

var router = express.Router();

const { verifyPassword, verifyGoogleAccount } = require('../middleware/loginMiddleware');
const {
  register, googleSignIn, login, resetPassword, resetPasswordCheck, resetPassPage
} = require('../controllers/authController');
const { mailer } = require('../controllers/mailer');

router.post(
  '/reset-password',
  resetPassword
);

router.post('/reset-password-check', resetPasswordCheck);

router.post('/reset-pass-page', resetPassPage);

router.post('/login', login);

router.post('/register', verifyPassword, register);

router.post('/googleLogin', verifyGoogleAccount, googleSignIn);

router.post('/sendMail', mailer);

module.exports = router;
