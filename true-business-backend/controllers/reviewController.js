const Review = require("../models/review");

const createReview = (req, res) => {
  // Todo:
  // Sign In Users so a review can be assigned to the actual reviewer

  // Allows for default photos
  if (!req.body.photos.length) {
    delete req.body.photos;
  }
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
  Review.find({ reviewer: req.params.id })
    .populate("newMongoId")
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => res.status(500).json(error));
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
