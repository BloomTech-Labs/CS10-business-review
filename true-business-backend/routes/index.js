const express = require('express');
const mongoose = require('mongoose');

require('../services/passport');
const UserController = require('../controllers/userController');
const BusinessController = require('../controllers/businessController');
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://metten:Lambdalabs1@ds251632.mlab.com:51632/truebusiness');
const stripe = require("stripe")("sk_test_5RHmYt9hi15VdwLeAkvxGHUx");

const router = express.Router();
require('../routes/authRoutes')(router);

router.get('/', (request, response) => {
  response.status(200).json({ api: 'Server running OK.' });
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

router.post('/api/business/create', (request, response) => {
  BusinessController.createBusiness(request, response);
});

router.post('/api/business/placesSearch', (request, response) => {
  BusinessController.placesSearch(request, response);
});

router.post('/api/business/placeSearch', (request, response) => {
  BusinessController.placeSearch(request, response);
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

// Guessing we should put this in a StripeController at some point.
router.post('/charge', async (req, res) => {
  let amount = req.body.selectedRadio === 'oneMonth' ? 999 : 4999;
  stripe.charges
    .create({ amount, currency: 'usd', description: 'An example charge', source: req.body.token.id })
    .then((status) => {
      console.log("Charge Status", status);
      res.json({ status });
    })
    .catch(err => {
      res.status(500).end();
    });
});


module.exports = router;
