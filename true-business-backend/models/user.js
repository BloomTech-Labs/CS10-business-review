const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  // Refers to whether they are "Monthly" or "Yearly"
  accountType: {
    type: String,
    default: "One Month",
  },
  // The date the account is activated
  accountActivated: {
    type: Date,
    default: Date.now(),
  },
  // presave hook will change this by a month or year
  accountDeactivated: {
    type: Date,
    default: Date.now(),
  },
  // For old-school way of registering I presume
  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    unique: true,
    required: true,
  },
  // Displayed on reviews and what not
  username: {
    type: String,
    unique: true,
    required: true,
  },
  // Guessing also only necessary for old-school way of registering
  password: {
    type: String,
    required: true,
  },
  // For google passport
  googleId: {
    type: String,
    default: "googleId" + (Math.floor(Math.random() * 1000000000) + 123456),
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  numberOfLikes: {
    type: Number,
    default: 0,
  },
  userImage: {
    type: Object,
    default: {
      link: "https://lh3.googleusercontent.com/p/AF1QipN_jrDDnnaw0vNmcbYsIv716tMzOQvgp2MlMMsA=s1600-w1000-h500",
      width: 3024,
      height: 4032,
    },
  },
});

let userModel = mongoose.model("User", userSchema);
// Pre-save hook
// Attempting to find a way to adjust the account Deactivated date.
// Definitely unfinished.
userSchema.pre("save", function(next) {
  userModel.find({ _id: this._id }, (err, docs) => {
    if (!docs.length) {
      if (this.accountType === "One Month") {
        let current = Date.now();
        this.accountDeactivated = moment(current).add(1, "M");
      } else {
        let current = Date.now();
        this.accountDeactivated = moment(current).add(12, "M");
      }
      next();
    } else {
      console.log("User exists already: ", this);
      next(new Error("User exists!", this));
    }
  });
});

module.exports = userModel;
