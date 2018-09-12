const express = require('express');

const UserController = require('../controllers/userController');
const BusinessController = require('../controllers/businessController');
const router = express.Router();
const Business = require('../API/businessModel');

router.get('/', (request, response) => {
  response.status(200).json({ api: 'Server running OK.' });
});

router.post('/register', (request, response) => {
  UserController.register(request, response);
});

router.post('/login', (request, response) => {
  UserController.login(request, response);
});

router.post('/api/Business', (request, response) => {
  BusinessController.createBusiness(request, response);
});

router.get('/api/business/:name', function(request, response) {
  BusinessController.getBusiness(request, response);
});

router.get('/api/business/:id', function(req, res) {
  const { id } = req.params;

  Business.findById(id)
    .then(function(business) {
      res.status(200).json(business);
    })
    .catch(function(error) {
      res
        .status(500)
        .json({ error: 'The information could not be retrieved.' });
    });
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
