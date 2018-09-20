const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  // Refers to whether they are "Monthly" or "Yearly"
  accountType: {
    type: String,
    requied: true,
  },
  // The date the account is activated
  // Need to possibly have a deactivate property as well
  // Not sure how to do that at the moment
  accountActivated: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  // For old-school way of registering I presume
  email: {
    type: String,
  },
  // Displayed on reviews and what not
  username: {
    type: String
  },
  // Guessing also only necessary for old-school way of registering
  password: {
    type: String
  },
  // For google passport
  googleId: {
    type: String
  },
  reviews: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Review'
  }],
  numberOfReview: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfLikes: {
    type: Number,
    required: true,
    default: 0,
  },
  userImage: {
    type: String,
  }
});

module.exports = mongoose.model("User", userSchema);

