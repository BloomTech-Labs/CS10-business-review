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
  console.log("SHIT", req.params.currentPage);
  Review.find({ [search]: req.params.id })
    .skip(10 * req.params.currentPage)
    .limit(10)
    .then(reviews => {
      Review.count().then(total => {
        console.log("FUCKING REVIEWS", reviews[0].title)
        res.status(200).json({ reviews, total });
      });
    })
    .catch(error => {
      res.status(200).json({ "ERROR BIATCH": error });
    });
};

// For Landing Page, Popular Review, do a sort
const getAllReviews = (req, res) => {
  Review.find({})
    .populate("reviewer newMongoId")
    .then(reviews => {
      res.status(200).json(reviews);
    })
    .catch(error => {
      res.status(500).json({ error });
    });
  // Review.find({})
  //   .skip(10 * req.params.currentPage )
  //   .limit(10)
  //   .then(response => {
  //     res.status(200).json(response);
  //   })
  //   .catch(error => {
  //     res.status(200).json;
  //   });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByBusinessId,
  getReviewsByReviewerId,
};
