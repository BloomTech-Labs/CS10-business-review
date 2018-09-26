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
    default: 'No Title Given'
  },
  body: {
    type: String,
    default: 'No Review Given'
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
      found.stars += business.stars;
      found.stars /= 2;
      found.stars = Math.round(found.stars);
      return found;
    });
    await Business.findOneAndUpdate(business.newMongoId, update)
      .then(updated => {
        console.log("Business Updated Successfully");
      })
      .catch(error => console.log({ error }));
  }
  updateBusiness();
  console.log("Eh?")
  next();
});

module.exports = reviewModel;
