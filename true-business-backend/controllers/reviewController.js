const Review = require("../models/review");
const User = require("../models/user");

const createReview = (req, res) => {
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
  console.log("Req.params", req.params)
  let { filter, sort } = req.params;
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
  Review.find({ reviewer: req.params.id })
    .find(filterNum > 0 ? { stars: filterNum } : {})
    .countDocuments()
    .then(total => {
      Review.find({ reviewer: req.params.id })
        .find(filterNum > 0 ? { stars: filterNum } : {})
        .sort(
          sort === "Rating Ascending" || sort === "Rating Descending"
            ? sort === "Rating Ascending"
              ? { stars: 1 }
              : { stars: -1 }
            : {},
        )
        .sort(
          sort === "Date Ascending" || sort === "Date Descending"
            ? sort === "Date Ascending"
              ? { createdOn: 1 }
              : { createdOn: -1 }
            : {},
        )
        .populate("reviewer newMongoId")
        .skip(9 * req.params.currentPage)
        .limit(9)
        .then(reviews => {
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
        .sort(
          sort === "Rating Ascending" || sort === "Rating Descending"
            ? sort === "Rating Ascending"
              ? { stars: 1 }
              : { stars: -1 }
            : {},
        )
        .sort(
          sort === "Date Ascending" || sort === "Date Descending"
            ? sort === "Date Ascending"
              ? { createdOn: 1 }
              : { createdOn: -1 }
            : {},
        )
        .populate("reviewer newMongoId")
        .skip(12 * req.params.currentPage)
        .limit(12)
        .then(reviews => {
          res.status(200).json({ reviews, total });
        });
    })
    .catch(error => {
      res.status(200).json({ error });
    });
};

const updateLikes = (req, res) => {
  // reviewerId --- person whose review was liked/unliked
  // reviewId --- review that was liked / unliked
  // userId --- person who did the liking / unliking
  // bool --- true === liked, false === unliked
  let { reviewerId, reviewId, userId, bool } = req.body;
  let review = new Promise(resolve => {
    return resolve(
      Review.findById({ _id: reviewId })
        .then(found => {
          let flag = true;
          if (bool) {
            for (let i = 0; i < found.likes.length; i++) {
              if (found.likes[i] === userId) {
                flag = false;
                break;
              }
            }
            if (flag) {
              found.numberOfLikes += 1;
              found.likes.push(userId);
              User.findById({ _id: reviewerId })
                .then(found => {
                  bool ? (found.numberOfLikes += 1) : (found.numberOfLikes -= 1);
                  User.findByIdAndUpdate({ _id: reviewerId }, found).then(updated => {
                    return updated;
                  });
                })
                .catch(err => {
                  res.status(500).json({ err });
                });
              Review.findByIdAndUpdate({ _id: reviewId }, found, { new: true })
                .then(updated => {
                  return updated;
                })
                .catch(err => {
                  res.status(500).json({ err });
                });
            }
          } else {
            for (let i = 0; i < found.unlikes.length; i++) {
              if (found.unlikes[i] === userId) {
                flag = false;
                break;
              }
            }
            if (flag) {
              found.numberOfLikes -= 1;
              found.unlikes.push(userId);
              User.findById({ _id: reviewerId })
                .then(found => {
                  bool ? (found.numberOfLikes += 1) : (found.numberOfLikes -= 1);
                  User.findByIdAndUpdate({ _id: reviewerId }, found).then(updated => {
                    return updated;
                  });
                })
                .catch(err => {
                  res.status(500).json({ err });
                });
              Review.findByIdAndUpdate({ _id: reviewId }, found, { new: true })
                .then(updated => {
                  return updated;
                })
                .catch(err => {
                  res.status(500).json({ err });
                });
            }
          }
        })
        .catch(err => {
          res.status(500).json({ err });
        }),
    );
  });
  Promise.all([review])
    .then(response => {
      res.status(200).json("Updated");
    })
    .catch(err => {
      res.status(500).json({ err });
    });
};

// For Landing Page
const getAllReviews = (req, res) => {
  Review.find({})
    .sort({ numberOfLikes: -1 })
    .limit(4)
    .populate("newMongoId reviewer")
    .then(response => {
      res.status(200).json(response);
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
  updateLikes,
};
