const Business = require('../models/business');

const createBusiness = (req, res) => {

    const { name, type, contact, image, stars, popularity, totalReviews } = req.body;
    console.log("Creating a Business: " + name)

    if (name && type && contact) {
        const business = new Business({ name, type, contact, image, stars, popularity, totalReviews});

    business
      .save() // returns a promise
      .then(function(business) {
        res.status(201).json(business);
      })
      .catch(function(error) {
        res.status(500).json({
          error:
            'There was an error while saving the Business to the Database. (' +
            error +
            ')'
        });
      });
  } else {
    res.status(400).json({
      errorMessage: 'Please provide both name and type for the Business.'
    });
  }
};

const getBusinessByName = (request, response) => {
  const { name } = request.params;
  console.log('Getting Business: ' + name);
  Business.findOne({ name: name })
    .then(business => {
      if (business) {
        response.status(200).json(business);
      } else {
        response.status(400).json({
          error: 'Business not found.'
        });
      }
    })
    .catch(function(error) {
      response.status(500).json({
        error:
          'The business information could not be retrieved. (' + error + ')'
      });
    });
};

const getBusinessById = (request, response) => {
  const { id } = request.params;

  Business.findById(id)
    .then(function(business) {
      response.status(200).json(business);
    })
    .catch(function(error) {
      response.status(500).json({
        error: 'The information could not be retrieved.'
      });
    });
};

const deleteBusinessById = (request, response) => {
    const { id } = request.params;

    Business
        .findByIdAndRemove(id)
        .then(function(business) {
            response.status(200).json(business);
        })
        .catch(function(error) {
            response.status(500).json({ 
                error: 'The business could not be removed.' 
            });
        });       
};

const getAllBusiness = (request, response) => {

    Business
        .find({})
        .then(function(business) {
            response.status(200).json(business);
        })
        .catch(function(error) {
            response.status(500).json({ 
                error: 'The information could not be retrieved.' 
            });
        });
};

module.exports = {
    createBusiness,
    getBusinessByName,
    getBusinessById,
    deleteBusinessById,
    getAllBusiness
};
