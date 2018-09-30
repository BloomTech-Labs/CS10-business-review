const Review = require("../models/review");

const createReview = (req, res) => {
  // Todo:
  // Upload user images to cloudinary
  // Sign In Users so a review can be assigned to the actual reviewer
  let newReview = new Review({ ...req.body });
  newReview
    .save()
    .then(review => {
      res.status(201).json(review);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

// For User Component
const getReviewsByReviewerId = (req, res) => {
  // Reviews.find({reviewer: req.body.id})
};

// For Business Component
const getReviewsByBusinessId = (req, res) => {
  let search = req.params.landing === "true" ? "newMongoId" : "newGoogleId";
  Review.find({ [search]: req.params.id })
    .populate("reviewer newMongoId")
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

// For Landing Page
const getAllReviews = (req, res) => {
  Review.find({})
    .populate("reviewer newMongoId")
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByBusinessId,
  getReviewsByReviewerId,
};
