const mongoose = require("mongoose");
const Business = require("../models/business");
const User = require("../models/user");

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: "5bb4f5a37e80b2009ed1972a",
  },
  newMongoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true,
  },
  newGoogleId: {
    type: String,
  },
  title: {
    type: String,
    default: "No Title Given",
  },
  body: {
    type: String,
    default: "No Review Given",
  },
  stars: {
    type: Number,
    required: true,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  // Sets the modified to the created on date initially
  // When we allow for reviews to be modified, make sure we pass this in.
  modifiedOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  photos: {
    type: Array,
    default: [
      {
        link: "https://png.icons8.com/ios/100/000000/picture.png",
        width: 100,
        height: 100,
      },
    ],
  },
  numberOfLikes: {
    type: Number,
    required: true,
    default: 0,
  },
  likes: {
    type: Array,
  },
  unlikes: {
    type: Array,
  }
});

let reviewModel = mongoose.model("Review", reviewSchema);

reviewSchema.post("save", function() {
  let business = this;
  let user = this;
  async function updateBusiness() {
    let update = await Business.findOne({ _id: business.newMongoId }).then(found => {
      found.reviews.push(business._id);
      found.totalReviews += 1;
      if (found.stars !== 0) {
        found.stars += business.stars;
        found.stars /= 2;
      } else {
        found.stars += business.stars;
      }
      return found;
    });
    await Business.updateOne(
      { _id: business.newMongoId },
      {
        reviews: update.reviews,
        totalReviews: update.totalReviews,
        stars: update.stars,
      },
    )
      .then(updated => {
        console.log("Business Updated Successfully");
      })
      .catch(error => console.log({ error }));
  }
  async function updateUser() {
    let update = await User.findOne({ _id: user.reviewer }).then(found => {
      found.reviews.push(user._id);
      found.numberOfReviews += 1;
      return found;
    });
    await User.updateOne(
      { _id: user.reviewer },
      {
        reviews: update.reviews,
        numberOfReviews: update.numberOfReviews,
      },
    )
      .then(updated => {
        console.log("Business Updated Successfully");
      })
      .catch(error => console.log({ error }));
  }
  updateBusiness();
  updateUser();
});

module.exports = reviewModel;
