const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  businessReviewed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    required: true,
  },
  reviewTitle: {
    type: String,
    required: true,
  },
  review: {
    type: String,
    required: true,
  },
  reviewerRating: {
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
  reviewerImages: [
    {
      type: String,
    },
  ],
});

module.exports = mongoose.model('Review', reviewSchema);
