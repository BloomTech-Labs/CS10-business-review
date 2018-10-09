const mongoose = require("mongoose");
const moment = require("moment");

const subscriberSchema = new mongoose.Schema({
  // Refers to whether they are "Monthly" or "Yearly"
  accountType: {
    type: String,
    default: "One Month"
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
    type: String
  },
  // Display name
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: "Email" + (Math.floor(Math.random() * 1000000000) + 123456)
  },
  // Displayed on reviews and what not
  subscribername: {
    type: String,
    default: "Subscriber" + (Math.floor(Math.random() * 1000000000) + 123456)
  },
  // Guessing also only necessary for old-school way of registering
  password: {
    type: String,
    default: "Password" + (Math.floor(Math.random() * 1000000000) + 123456)
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
  subscriberImage: {
    type: String,
    default:
      "subscriberImage" + (Math.floor(Math.random() * 1000000000) + 123456)
  }
});

let subscriberModel = mongoose.model("Subscriber", subscriberSchema);
// Pre-save hook
// Attempting to find a way to adjust the account Deactivated date.
// Definitely unfinished.
subscriberSchema.pre("save", function(next) {
  subscriberModel.find({ _id: this._id }, (err, docs) => {
    if (!docs.length) {
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

module.exports = subscriberModel;
