const express = require("express");
const mongoose = require("mongoose");

require("../services/passport");
const SubscriberController = require("../controllers/userController");
const BusinessController = require("../controllers/businessController");
const ReviewControler = require("../controllers/reviewController");
const router = express.Router();
require("../routes/authRoutes")(router);
require("../services/passport");
mongoose.Promise = global.Promise;

mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness",
  {},
  function(err) {
    if (err) console.log(err);
  }
);
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");

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

router.post("/register", (request, response) => {
  SubscriberController.register(request, response);
});

router.post("/login", (request, response) => {
  SubscriberController.login(request, response);
});

router.get("/api/subscriber/:id", function(req, res) {
  SubscriberController.getSubscriberById(req, res);
});

router.delete("/api/subscriber/:id", function(req, res) {
  SubscriberController.deleteSubscriberById(req, res);
});

router.get("/api/subscriber/", function(req, res) {
  SubscriberController.getAllSubscribers(req, res);
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

// Guessing we should put this in a StripeController at some point.
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
