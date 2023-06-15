/* eslint-disable consistent-return */
/* eslint-disable no-underscore-dangle */

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');

dotenv.config();
// const { v4: uuidV4 } = require('uuid');
// const bodyParser = require('body-parser');

// app.use(bodyParser.json());

// models
const User = require('../model/user'); // Mongo User Schema
const { mailer } = require('./mailer'); // Nodemailer

const { JWT_SECRET } = process.env;

// Login function
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).lean(); // check if user is exists in database

  if (!user) {
    return res.status(401).json({ status: 'error', error: 'User not found' }); // return if user not found
  }

  if (await bcrypt.compare(password, user.password)) {
    // the email, password combination is successful

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      JWT_SECRET
    ); // Generate JWT token

    return res.status(200).json({
      status: 'ok', id: user._id, token, email
    }); // Send token and email as response
  }

  res.status(401).json({ status: 'error', error: 'Invalid email/password' }); // Send error if email or password is invalid
};

// Register function
const register = async (req, res) => {
  var userRes = [];
  console.log('req:', req.body);
  const {
    email, password: plainTextPassword, firstName, lastName
  } = req.body;

  const user = await User.findOne({ email }).lean();

  if (user) {
    return res.status(500).json({ status: 'error', error: 'user with this email already exists' }); // existing use check
  }
  if (!email || typeof email !== 'string') {
    return res.status(500).json({ status: 'error', error: 'Invalid email' }); // email check
  }
  const encryptPassword = await bcrypt.hash(plainTextPassword, 10); // encrypt password

  try {
    const response = await User.create({ // create new user
      email,
      password: encryptPassword,
      first_name: firstName,
      last_name: lastName
    });
    if (await bcrypt.compare(plainTextPassword, response.password)) {
      // the email, password combination is successful
      const token = jwt.sign(
        {
          id: response._id,
          email: response.email
        },
        JWT_SECRET
      ); // Generate JWT token
      userRes = { id: response._id, token };
      // return userRes;
      // return res.status(200).json({ status: 'ok', data: userRes });
    }
  }
  catch (error) {
    if (error.code === 11000) {
      // error.code === 11000 duplicate key
      return res.status(500).json({ status: 'error', error: 'email already in use' });
    }
    throw error;
  }
  return res.status(200).json({ status: 'ok', id: userRes.id, token: userRes.token }); // return newly created user
};

// Sign in with Google Verification
const googleSignIn = async (req, res) => {
  const { profileObj, googleApiRes } = req.body;

  if (profileObj.email === googleApiRes.email) {
    const body = { email: profileObj.email, password: googleApiRes.sub };
    const registerDetail = { body };
    const { email } = profileObj;
    const user = await User.findOne({ email }).lean();
    if (user) {
      await login(profileObj);
    }
    else {
      await register(registerDetail, res);
    }
  }
  else {
    return res.status(500).json({ status: 'error', message: 'user is not verified with google' });
  }
};

// Reset password send mail to user with reset password link
const resetPassword = async (req, res) => {
  console.log('reset password', req.body);
  const { email } = req.body;
  const user = await User.findOne({ email }).lean();

  if (!user) {
    return res.status(500).json({ status: 'error', error: 'user with this email not exists, create new account' });
  }

  try {
    const token = await jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      JWT_SECRET
    );
    mailer(email, token).catch(console.error);
  }
  catch (error) {
    console.error('user:', error);
  }

  // try {
  //   const user = jwt.verify(token, JWT_SECRET);

  //   const _id = user.id;

  //   const password = await bcrypt.hash(plainTextPassword, 10);

  //   await User.updateOne(
  //     { _id },
  //     {
  //       $set: { password }
  //     }
  //   );
  //   res.json({ status: 'ok' });
  // }
  // catch (error) {
  //   console.log(error);
  //   res.json({ status: 'error', error: ';))' });
  // }
  res.status(200).json({ status: 'ok' });
};

// Check if reset password link is valid or not
const resetPasswordCheck = async (req, res) => {
  const { token } = req.body;
  const user = jwt.verify(token, JWT_SECRET);
  console.log('user', user);
  res.status(200).json({ status: 'ok', data: user });
};

// Resets the password from reset password page
const resetPassPage = async (req, res) => {
  console.log('reset pass from page', req.body);
  const { email, password: plainTextPassword } = req.body;

  const encryptedPassword = await bcrypt.hash(plainTextPassword, 10);
  const user = await User.findOneAndUpdate({ email }, { password: encryptedPassword }).lean();
  console.log('user found', user);
  res.status(200).json({ status: 'ok', data: 'reset' });
};

module.exports = {
  login, register, resetPassword, googleSignIn, resetPasswordCheck, resetPassPage
};
