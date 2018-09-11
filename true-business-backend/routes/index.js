const express = require('express');

const UserController = require('../controllers/userController');
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

router.post('/api/Business', (req, res) => {
  const business = req.body;
  console.log(business);

  if (business.name && business.type && business.contact) {
    const chicken = new Business(business);

    chicken
      .save() // returns a promise
      .then(function(business) {
        res.status(201).json(business);
      })
      .catch(function(error) {
        res.status(500).json({
          error: 'There was an error while saving the Business to the Database'
        });
      });
  } else {
    res.status(400).json({
      errorMessage: 'Please provide both name and type for the Business.'
    });
  }
});

router.get('/api/business', function(req, res) {
  business
    .find({})
    .then(function(business) {
      res.status(200).json(business);
    })
    .catch(function(error) {
      res
        .status(500)
        .json({ error: 'The information could not be retrieved.' });
    });
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
