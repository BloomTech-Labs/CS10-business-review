const express = require("express");
const mongoose = require("mongoose");
const UserController = require("../controllers/userController");
const BusinessController = require("../controllers/businessController");
const ReviewControler = require("../controllers/reviewController");
const router = express.Router();
require("../routes/authRoutes")(router);
require("../services/passport");
mongoose.Promise = global.Promise;

const bodyParser = require("body-parser");

const jwt = require("jsonwebtoken");

mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness",
  {},
  function(err) {
    if (err) console.log(err);
  },
);

mongoose.Promise = global.Promise;
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");

const restricted = (request, response, next) => {
  const token = request.header.authorization;
  if (token) {
    jwt.verify(token, process.env.REACT_APP_SECRET, (err, decodedToken) => {
      if (err) {
        return response.status(401).json({ message: "Haha! Unauthorized!" });
      }
      console.log("Restricted");
      next();
    });
  } else {
    response.status(401).json({ message: "You need some token, my Friend!" });
  }
};

router.get("/", (request, response) => {
  response.status(200).json({ api: "Server running OK." });
});

router.post("/api/user/register", (request, response) => {
  UserController.register(request, response);
});

router.post("/api/user/registerGoogle", (req, res) => {
  UserController.createGoogleUser(req, res);
});

router.post("/api/user/login", (req, res) => {
  UserController.login(req, res);
});

router.put("/api/user/update/:id", function(request, response) {
  UserController.updateUser(request, response);
});

router.get("/api/user/random", function(req, res) {
  UserController.getRandomUser(req, res);
});

router.post("/api/user/current", function(request, response) {
  UserController.getGoogleUser(request, response);
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

router.get("/api/business/google/:id", function(req, res) {
  BusinessController.getBusinessByGoogleId(req, res);
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

router.put("/api/reviews/updateLikes", (req,res) => {
  ReviewControler.updateLikes(req,res);
})

router.get("/api/review/getReviewsByReviewerId/:id/:currentPage/:filter/:sort", (req, res) => {
  ReviewControler.getReviewsByReviewerId(req, res);
});

router.get("/api/review/getAllReviews/", (req, res) => {
  ReviewControler.getAllReviews(req, res);
});

router.get("/api/review/getReviewsByBusinessId/:id/:landing/:currentPage/:filter/:sort", (req, res) => {
  ReviewControler.getReviewsByBusinessId(req, res);
});

router.post("/charge", async (req, res) => {
  let amount = req.body.selectedRadio === "oneMonth" ? 999 : 4999;
  stripe.charges
    .create({
      amount,
      currency: "usd",
      description: "An example charge",
      source: req.body.token.id,
    })
    .then(status => {
      res.json({ status });
    })
    .catch(err => {
      res.status(500).end();
    });
});

module.exports = router;
