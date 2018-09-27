const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const cloudinary = require("cloudinary");
const UserController = require("../controllers/userController");
const BusinessController = require("../controllers/businessController");
const ReviewControler = require("../controllers/reviewController");
var cloudinaryStorage = require("multer-storage-cloudinary");
const router = express.Router();
require("../routes/authRoutes")(router);
require("../services/passport");
mongoose.Promise = global.Promise;

const bodyParser = require("body-parser");

const storage = multer.diskStorage({
  destination: "../../true-business/src/imgs/upload",
  filename: function(req, file, callback) {
    //..
  }
});
//configure cloudinary
cloudinary.config({
  cloud_name: "ddhamypia",
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET
});
console.log(process.env.REACT_APP_CLOUDINARY_API_SECRET);

mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness",
  {},
  function(err) {
    if (err) console.log(err);
  }
);
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");

router.get("/", (request, response) => {
  response.status(200).json({ api: "Server running OK." });
});

router.post("/register", (request, response) => {
  UserController.register(request, response);
});

router.post("/login", (request, response) => {
  UserController.login(request, response);
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

router.get("/api/business/:id", function(req, res) {
  BusinessController.getBusinessById(req, res);
});

router.delete("/api/business/:id", function(req, res) {
  BusinessController.deleteBusinessById(req, res);
});

router.get("/api/business/", function(req, res) {
  BusinessController.getAllBusiness(req, res);
});

cloudinary.v2.uploader.upload(
  "/Users/metten/Desktop/Lambda/CS10-business-review/true-business/src/imgs/upload/donkey.jpg",
  { public_id: "donkeyface" },
  function(error, result) {
    console.log(result, error);
  }
);

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
