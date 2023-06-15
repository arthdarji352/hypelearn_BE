/* eslint-disable consistent-return */

const request = require('request-promise');

const verifyPassword = (req, res, next) => {
  const { password: plainTextPassword } = req.body;

  if (!plainTextPassword || typeof plainTextPassword !== 'string') {
    return res.status(500).json({ status: 'error', error: 'Invalid password' });
  }

  if (plainTextPassword.length < 8) {
    return res.status(500).json({
      status: 'error',
      error: 'Password too small. Should be atleast 6 characters'
    });
  }
  next();
};

const verifyGoogleAccount = async (req, res, next) => {
  const options = {
    method: 'GET',
    uri: `https://www.googleapis.com/oauth2/v3/tokeninfo?id_token=${req.body.tokenId}`,
    json: true,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  await request(options).then((response) => {
    req.body.googleApiRes = response;
  })
    .catch((err) => {
      console.log(err);
    });
  next();
};

module.exports = { verifyPassword, verifyGoogleAccount };
