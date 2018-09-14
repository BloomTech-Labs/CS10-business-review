const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  // username: {
  //   type: String,
  //   required: true
  // },
  // password: {
  //   type: String,
  //   required: true
  // },
  {
    googleId: String
  }
);

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
