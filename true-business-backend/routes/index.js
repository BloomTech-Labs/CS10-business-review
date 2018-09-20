const express = require("express");
const mongoose = require("mongoose");
const authController = require("../controllers/authController");

require("../services/passport");
const UserController = require("../controllers/userController");
const BusinessController = require("../controllers/businessController");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness"
);

const router = express.Router();
require("../routes/authRoutes")(router);

router.get("/", (request, response) => {
  response.status(200).json({ api: "Server running OK." });
});

/* Not Needed
router.get("/authuser", (request, response) => {
  console.log("getting to /authuser in routes/index");
  authController.authUser(request, response);
});
*/

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

router.post("/charge", async (req, res) => {
  try {
    let { status } = await stripe.charges.create({
      amount: 2000,
      currency: "usd",
      description: "An example charge",
      source: req.body
    });

    res.json({ status });
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;
