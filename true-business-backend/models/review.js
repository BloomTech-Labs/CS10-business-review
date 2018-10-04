<<<<<<< HEAD
const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscriber",
    required: true
  },
  businessReviewed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },
  reviewTitle: {
    type: String,
    required: true
  },
  review: {
    type: String,
    required: true
  },
  reviewerRating: {
    type: Number,
    required: true
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now()
  },
  // Sets the modified to the created on date initially
  // When we allow for reviews to be modified, make sure we pass this in.
  modifiedOn: {
    type: Date,
    required: true,
    default: Date.now()
  },
  reviewerImages: [
    {
      type: String
    }
  ],
  numberOfLikes: {
    type: Number,
    required: true,
    default: 0
  }
});

module.exports = mongoose.model("Review", reviewSchema);
=======
const mongoose = require("mongoose");
const Business = require("../models/business");

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    default: "5bb2a7bc36929201322a9000",
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
        link: "https://png.icons8.com/ios/50/000000/picture.png",
        width: 3024,
        height: 4032,
      },
    ],
  },
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
  updateBusiness(next);
});

module.exports = reviewModel;
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
