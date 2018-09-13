const express = require('express');

const UserController = require('../controllers/userController');
const BusinessController = require('../controllers/businessController');
const router = express.Router();

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
