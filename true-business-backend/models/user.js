const mongoose = require("mongoose");
const moment = require("moment");

<<<<<<< HEAD
const subscriberSchema = new mongoose.Schema({
  // Refers to whether they are "Monthly" or "Yearly"
  accountType: {
    type: String,
    default: "One Month"
=======
const userSchema = new mongoose.Schema({
  // Refers to whether they are "Trial, ""Monthly", or "Yearly"
  accountType: {
    type: String,
    default: "Trial",
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
  },
  // The date the account is activated
  accountActivated: {
    type: Date,
    default: Date.now()
  },
  // presave hook will change this by a month or year
  accountDeactivated: {
    type: Date,
    default: Date.now()
  },
  token: {
    type: String,
  },
  // Display name
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
<<<<<<< HEAD
    default: "Email" + (Math.floor(Math.random() * 1000000000) + 123456)
  },
  // Displayed on reviews and what not
  subscribername: {
    type: String,
    default: "Subscriber" + (Math.floor(Math.random() * 1000000000) + 123456)
=======
    unique: true,
    required: true,
  },
  // login name
  username: {
    type: String,
    unique: true,
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
  },
  // Guessing also only necessary for old-school way of registering
  password: {
    type: String,
<<<<<<< HEAD
    default: "Password" + (Math.floor(Math.random() * 1000000000) + 123456)
=======
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
  },
  // For google passport
  googleId: {
    type: String,
    default: "googleId" + (Math.floor(Math.random() * 1000000000) + 123456)
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Review"
    }
  ],
  numberOfReviews: {
    type: Number,
    default: 0
  },
  numberOfLikes: {
    type: Number,
    default: 0
  },
<<<<<<< HEAD
  subscriberImage: {
    type: String,
    default: "subscriberImage" + (Math.floor(Math.random() * 1000000000) + 123456)
  }
});

let subscriberModel = mongoose.model("Subscriber", subscriberSchema);
// Pre-save hook
// Attempting to find a way to adjust the account Deactivated date.
// Definitely unfinished.
subscriberSchema.pre("save", function(next) {
  subscriberModel.find({ _id: this._id }, (err, docs) => {
    if (!docs.length) {
=======
  userImages: {
    type: Array,
    default: [
      {
        link: "https://png.icons8.com/ios/50/000000/user-filled.png",
        width: 3024,
        height: 4032,
      },
    ],
  },
});

// Pre-validate hook
userSchema.pre("validate", function(next) {
  userModel.find({ _id: this._id }, (err, docs) => {
    if (!docs.length && this.isNew) {
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
      if (this.accountType === "One Month") {
        let current = Date.now();
        this.accountDeactivated = moment(current).add(1, "M");
      } else if (this.accountType === "Trial") {
        let current = Date.now();
        this.accountDeactivated = moment(current).add(1, "w");
      } else {
        let current = Date.now();
        this.accountDeactivated = moment(current).add(1, "y");
      }
      next();
    } else {
      console.log("Subscriber exists already: ", this);
      next(new Error("Subscriber exists!", this));
    }
  });
});

<<<<<<< HEAD
module.exports = subscriberModel;
=======
let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
