const express = require("express");
const server = require("../server");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const keys = require("../config/keys");
require("../models/User");
require("../services/passport");
const UserController = require("../controllers/userController");
const BusinessController = require("../controllers/businessController");
mongoose.Promise = global.Promise;
mongoose.connect(
  "mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness"
);

const router = express.Router();
require("../routes/authRoutes")(router);

router.use(bodyParser.json());
router.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);
router.use(passport.initialize());
router.use(passport.session());

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
