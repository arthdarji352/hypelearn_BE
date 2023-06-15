const bcrypt = require('bcrypt');

const encryptEmail = async (id) => {
  const encryptedEmail = await bcrypt.hash(id, 10);
  console.log('encrypted email', encryptedEmail);
  return encryptedEmail;
};

module.exports = { encryptEmail };
