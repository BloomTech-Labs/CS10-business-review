const mongoose = require("mongoose");
const Business = require("../models/business");

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: "5ba9827275255602768e8ef4",
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
  photos: [
    {
      type: String,
    },
  ],
  numberOfLikes: {
    type: Number,
    required: true,
    default: 0,
  },
});

let reviewModel = mongoose.model("Review", reviewSchema);

reviewSchema.post("save", function(next) {
  let business = this;
  async function updateBusiness() {
    let update = await Business.findOne({ _id: business.newMongoId }).then(found => {
      found.reviews.push(business._id);
      found.totalReviews += 1;
      if (found.stars !== 0) {
        found.stars += business.stars;
        found.stars /= 2;
      }
      else {
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
        console.log("Business Updated Successfully", updated);
      })
      .catch(error => console.log({ error }));
  }
  updateBusiness(next);
});

module.exports = reviewModel;
