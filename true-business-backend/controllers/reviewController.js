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
    .skip(8 * req.params.currentPage)
    .limit(8)
    .populate("reviewer newMongoId")
    .then(reviews => {
      Review.find({ reviewer: req.params.id })
        .count()
        .then(total => {
          res.status(200).json({ reviews, total });
        });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
};

// For Business Component
const getReviewsByBusinessId = (req, res) => {
  let { filter, sort } = req.params;
  let search = req.params.landing === "true" ? "newMongoId" : "newGoogleId";
  switch (filter) {
    case "5 Stars":
      filterNum = 5;
      break;
    case "4 Stars":
      filterNum = 4;
      break;
    case "3 Stars":
      filterNum = 3;
      break;
    case "2 Stars":
      filterNum = 2;
      break;
    case "1 Stars":
      filterNum = 1;
      break;
    // NoFilter
    default:
      filterNum = 0;
  }

  Review.find({ [search]: req.params.id })
    .find(filterNum > 0 ? { stars: filterNum } : {})
    .countDocuments()
    .then(total => {
      Review.find({ [search]: req.params.id })
        .find(filterNum > 0 ? { stars: filterNum } : {})
        .sort(sort === "Rating Ascending" ? { stars: 1 } : { stars: -1 })
        .populate("reviewer newMongoId")
        .skip(12 * req.params.currentPage)
        .limit(12)
        .then(reviews => {
          res.status(200).json({ reviews, total });
        });
    })
    .catch(error => {
      res.status(200).json({ "ERROR BIATCH": error });
    });
};

// For Landing Page
const getAllReviews = (req, res) => {
  Review.find({})
    // Don't include this when we get likes
    .limit(4)
    .populate("newMongoId reviewer")
    .then(reviews => {
      // let featured = [];
      // let likes = 100;
      // While we don't have 4 featured reviews
      // When we get likes going, do the same things users
      // while (featured.length < 4 && reviews >= 0) {
      //   // While we have an empty DB this may be slow...
      //   users.forEach(user => {
      //     if (user.numberOfReviews > reviews && !featured.includes(user)) {
      //       featured.push(user);
      //     }
      //   });
      //   reviews -= 10;
      // }
      res.status(200).json(reviews);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The information could not be retrieved.",
      });
    });
};

module.exports = {
  createReview,
  getAllReviews,
  getReviewsByBusinessId,
  getReviewsByReviewerId,
};
