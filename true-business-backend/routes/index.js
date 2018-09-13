const express = require('express');
const server = require('../server');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

const UserController = require('../controllers/userController');
const BusinessController = require('../controllers/businessController');
const router = express.Router();

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleAuthClientID,
      clientSecret: keys.googleAuthSecret,
      callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken);
      console.log(accessToken);
      console.log(accessToken);
    }
  )
);

router.get(
  '/auth/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get('/auth/google/callback', passport.authenticate('google'));

router.get('/', (request, response) => {
  response.status(200).json({ api: 'Server running OK.' });
});

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});

router.post('/register', (request, response) => {
  UserController.register(request, response);
});

router.post('/login', (request, response) => {
  UserController.login(request, response);
});

router.get('/api/user/:id', function(req, res) {
  UserController.getUserById(req, res);
});

router.delete('/api/user/:id', function(req, res) {
  UserController.deleteUserById(req, res);
});

router.get('/api/user/', function(req, res) {
  UserController.getAllUsers(req, res);
});

router.post('/api/Business', (request, response) => {
  BusinessController.createBusiness(request, response);
});

router.get('/api/business/ByName/:name', function(request, response) {
  BusinessController.getBusinessByName(request, response);
});

router.get('/api/business/:id', function(req, res) {
  BusinessController.getBusinessById(req, res);
});

router.delete('/api/business/:id', function(req, res) {
  BusinessController.deleteBusinessById(req, res);
});

router.get('/api/business/', function(req, res) {
  BusinessController.getAllBusiness(req, res);
});

// router.get("/API/Business", function(req, res) {
//     Business.find({}, function(err, allbusiness))
//     if(err){
//         console.log(err);
//     } else {
//         res.render("business", {business:allBusiness});
//     }
// });

// const target = new Business({
//   name: 'Target',
//   type: 'Big Box Retail',
//   contact: 'scott@target.com'
// });

// target.save(function(err, business) {
//   if (err) {
//     console.log('Something went wrong!');
//   } else {
//     console.log(business);
//   }
// });

module.exports = router;
