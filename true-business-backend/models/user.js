const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String
  },
  password: {
    type: String
  },
  googleId: {
    type: String
  }
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
