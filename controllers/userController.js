const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const User = require('../model/user');

const { JWT_SECRET } = process.env;

const getUser = async (req, res) => {
  const { token } = req.body;
  const {email} = jwt.verify(token, JWT_SECRET);
  const user = await User.findOne({ email }).lean();
  delete user.password;
  res.status(200).json({ status: 'ok', data: user });
};

module.exports = { getUser };
