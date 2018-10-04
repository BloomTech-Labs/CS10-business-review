const mongoose = require("mongoose");
const moment = require("moment");

const userSchema = new mongoose.Schema({
  // Refers to whether they are "Trial, ""Monthly", or "Yearly"
  accountType: {
    type: String,
    default: "Trial"
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
    unique: true,
    required: true
  },
  // login name
  username: {
    type: String,
    unique: true
  },
  // Guessing also only necessary for old-school way of registering
  password: {
    type: String
  },
  // For google passport
  google: {
    id: profile.id,
    email: profile.emails[0].value,
    username: profile.displayName
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
  userImages: {
    type: Array,
    default: [
      {
        link: "https://png.icons8.com/ios/50/000000/user-filled.png",
        width: 3024,
        height: 4032
      }
    ]
  }
});

// Pre-validate hook
userSchema.pre("validate", function(next) {
  userModel.find({ _id: this._id }, (err, docs) => {
    if (!docs.length && this.isNew) {
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
      console.log("User exists already: ", this);
      next(new Error("User exists!", this));
    }
  });
});

let userModel = mongoose.model("User", userSchema);

module.exports = userModel;
