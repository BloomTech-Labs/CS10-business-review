const express = require("express");
const mongoose = require("mongoose");

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

router.post("/api/Business", (request, response) => {
  BusinessController.createBusiness(request, response);
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

module.exports = router;
