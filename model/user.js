const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    first_name: { type: String },
    last_name: { type: String }
  },
  { collection: 'users' }
);

const model = mongoose.model('UserSchema', UserSchema);

module.exports = model;
