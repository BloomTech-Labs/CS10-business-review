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

const updateReview = (req, res) => {
  //   let updatedReview = req.body;
  //   Review.findByIdAndUpdate(id)
  //     .then(review => {
  //       response.status(200).json(business);
  //     })
  //     .catch(error => {
  //       response.status(500).json({
  //         error: "The information could not be retrieved.",
  //       });
  //     });
};

const deleteReview = (req, res) => {
  // let id = req.body.id;
  // Business.findByIdAndRemove(id)
  //   .then(business => {
  //     response.status(200).json("Review Deleted", business);
  //   })
  //   .catch(error => {
  //     response.status(500).json({
  //       error: "The review could not be removed.",
  //     });
  //   });
};

// For User Component
const getReviewsByReviewerId = (req, res) => {
  // Reviews.find({reviewer: req.body.id})
};

// For Business Component
const getReviewsByBusinessId = (req, res) => {
  let search = req.params.landing === 'true' ? "newMongoId" : "newGoogleId";
  Review.find({ [search]: req.params.id })
    .populate("reviewer")
    .then(reviews => {
      console.log("reviews", reviews);
      res.status(200).json(reviews);
    })
    .catch(error => {
      res.status(500).json(error);
    });
};

// For Landing Page I suppose?
const getAllReviews = (req, res) => {
  // Review.find({})
  //   .then(reviews => {
  //     response.status(200).json(reviews);
  //   })
  //   .catch(error => {
  //     response.status(500).json({
  //       error: "The information could not be retrieved.",
  //     });
  //   });
};

module.exports = {
  createReview,
  updateReview,
  deleteReview,
  getAllReviews,
  getReviewsByBusinessId,
  getReviewsByReviewerId,
};
