const express = require("express");
const mongoose = require("mongoose");
<<<<<<< HEAD

require("../services/passport");
const SubscriberController = require("../controllers/userController");
=======
const UserController = require("../controllers/userController");
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
const BusinessController = require("../controllers/businessController");
const ReviewControler = require("../controllers/reviewController");
const router = express.Router();
require("../routes/authRoutes")(router);
require("../services/passport");
mongoose.Promise = global.Promise;

<<<<<<< HEAD
mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness",
  {},
  function(err) {
    if (err) console.log(err);
  }
);
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");
=======
const bodyParser = require("body-parser");
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796

mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness",
  {},
  function(err) {
    if (err) console.log(err);
  }
);

mongoose.Promise = global.Promise;
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");

router.get("/", (request, response) => {
  response.status(200).json({ api: "Server running OK." });
});

<<<<<<< HEAD
router.post("/register", (request, response) => {
  SubscriberController.register(request, response);
});

router.post("/login", (request, response) => {
  SubscriberController.login(request, response);
});

router.get("/api/subscriber/:id", function(req, res) {
  SubscriberController.getSubscriberById(req, res);
=======
router.post("/api/user/register", (request, response) => {
  UserController.register(request, response);
});

router.post("/api/user/login", (request, response) => {
  UserController.login(request, response);
});

router.put("/api/user/:_id", (request, response) => { 

  UserController.reset_password(request, response);
});

router.get("/api/user/random", function(req, res) {
  UserController.getRandomUser(req, res);
});

router.get("/api/user/:id", function(req, res) {
  UserController.getUserById(req, res);
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
});

router.delete("/api/subscriber/:id", function(req, res) {
  SubscriberController.deleteSubscriberById(req, res);
});
<<<<<<< HEAD

router.get("/api/subscriber/", function(req, res) {
  SubscriberController.getAllSubscribers(req, res);
=======
router.put("/api/user/:_id", function(req, res) {
  UserController.updateUser(req, res);
});
router.get("/api/user/", function(req, res) {
  UserController.getAllUsers(req, res);
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
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

router.delete("/api/business/:id", function(req, res) {
  BusinessController.deleteBusinessById(req, res);
});

router.get("/api/business/", function(req, res) {
  BusinessController.getAllBusiness(req, res);
});

<<<<<<< HEAD
// Guessing we should put this in a StripeController at some point.
=======
router.post("/api/review/create", (req, res) => {
  ReviewControler.createReview(req, res);
});

router.post("/api/review/update", (req, res) => {
  ReviewControler.updateReview(req, res);
});

router.delete("/api/review/delete", (req, res) => {
  ReviewControler.deleteReview(req, res);
});

router.get("/api/review/getAllReviews", (req, res) => {
  ReviewControler.getAllReviews(req, res);
});

router.get("/api/review/getReviewsByBusinessId/:id/:landing", (req, res) => {
  ReviewControler.getReviewsByBusinessId(req, res);
});

>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
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
