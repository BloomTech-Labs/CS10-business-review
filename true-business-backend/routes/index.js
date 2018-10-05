const express = require("express");
const mongoose = require("mongoose");
const UserController = require("../controllers/userController");
const BusinessController = require("../controllers/businessController");
const ReviewControler = require("../controllers/reviewController");
const router = express.Router();
require("../routes/authRoutes")(router);
require("../services/passport");
const paginate = require("express-paginate");
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");

mongoose.Promise = global.Promise;

const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");

mongoose.connect(
  "mongodb:process.env.REACT_APP_DB_URI",
  {},
  function(err) {
    if (err) console.log(err);
  }
);

router.get("/", (request, response) => {
  response.status(200).json({ api: "Server running OK." });
});

// // // START PAGINATE CODE
// // // keep this before all routes that will use pagination
// router.use(paginate.middleware(10, 50));

// router.get("/api/business/", async (req, res, next) => {
//   // This example assumes you've previously defined `business`
//   // as `const Users = db.model('Users')` if you are using `mongoose`
//   // and that you are using Node v7.6.0+ which has async/await support
//   try {
//     const [results, itemCount] = await Promise.all([
//       Business.find({})
//         .limit(req.query.limit)
//         .skip(req.skip)
//         .lean()
//         .exec(),
//       Business.count({})
//     ]);

//     const pageCount = Math.ceil(itemCount / req.query.limit);

//     if (req.accepts("json")) {
//       // inspired by Stripe's API response for list objects
//       res.json({
//         object: "list",
//         has_more: paginate.hasNextPages(req)(pageCount),
//         data: results
//       });
//     } else {
//       res.render("business", {
//         users: results,
//         pageCount,
//         itemCount,
//         pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
//       });
//     }
//   } catch (err) {
//     next(err);
//   }
// });

// // END PAGINATE CODE

router.post("/api/user/register", (request, response) => {
  UserController.register(request, response);
});

router.post("/api/user/login", (req, res) => {
  UserController.login(req, res);
});

router.put("/api/user/:_id", (request, response) => {
  UserController.reset_password(request, response);
});

router.get("/api/user/random", function(req, res) {
  UserController.getRandomUser(req, res);
});

router.get("/api/user/:id", function(req, res) {
  UserController.getUserById(req, res);
});

router.delete("/api/user/:id", function(req, res) {
  UserController.deleteUserById(req, res);
});

router.get("/api/user/", function(req, res) {
  UserController.getAllUsers(req, res);
});

router.post("/api/business/create", (request, response) => {
  BusinessController.createBusiness(request, response);
});

router.post("/api/business/placesSearch", (request, response) => {
  BusinessController.placesSearch(request, response);
});

router.post("/api/business/placeSearch", (request, response) => {
  BusinessController.placeSearch(request, response);
});

router.get("/api/business/ByName/:name", function(request, response) {
  BusinessController.getBusinessByName(request, response);
});

router.get("/api/business/random", function(req, res) {
  BusinessController.getRandomBusiness(req, res);
});

router.get("/api/business/:id", function(req, res) {
  BusinessController.getBusinessById(req, res);
});

router.get("/api/user/random", function(req, res) {
  UserController.getRandomUser(req, res);
});

router.get("/api/business/random", function(req, res) {
  BusinessController.getRandomBusiness(req, res);
});

router.delete("/api/business/:id", function(req, res) {
  BusinessController.deleteBusinessById(req, res);
});

router.get("/api/business/", function(req, res) {
  BusinessController.getAllBusiness(req, res);
});

router.post("/api/review/create", (req, res) => {
  ReviewControler.createReview(req, res);
});

router.post("/api/review/update", (req, res) => {
  ReviewControler.updateReview(req, res);
});

router.delete("/api/review/delete", (req, res) => {
  ReviewControler.deleteReview(req, res);
});

router.get(
  "/api/review/getReviewsByReviewerId/:id/:currentPage",
  (req, res) => {
    ReviewControler.getReviewsByReviewerId(req, res);
  }
);

router.get("/api/review/getAllReviews/", (req, res) => {
  ReviewControler.getAllReviews(req, res);
});

router.get(
  "/api/review/getReviewsByBusinessId/:id/:landing/:currentPage",
  (req, res) => {
    ReviewControler.getReviewsByBusinessId(req, res);
  }
);

router.post("/charge", async (req, res) => {
  let amount = req.body.selectedRadio === "oneMonth" ? 999 : 4999;
  stripe.charges
    .create({
      amount,
      currency: "usd",
      description: "An example charge",
      source: req.body.token.id
    })
    .then(status => {
      res.json({ status });
    })
    .catch(err => {
      res.status(500).end();
    });
});

module.exports = router;
