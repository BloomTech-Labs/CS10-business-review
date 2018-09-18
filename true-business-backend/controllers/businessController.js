const Business = require('../models/business');
const googleMapsClient = require('@google/maps').createClient({
    key: 'AIzaSyCy5ymI0_0Ko4q0K0JHfe3d2JASObGcHaw',
    Promise: Promise
});

const createBusiness = (req, res) => {
    const { name, type, contact, image, stars, popularity, totalReviews, location } = req.body;
    console.log("Creating a Business: " + name);

    if (!name || !type || !contact) {
        response.status(500).json({ 
            error: 'The business information could not be retrieved. (' + error + ')' 
        });
        return;
    }

    googleMapsClient
        .geocode({ address: location.address })
        .asPromise()
        .then((response) => {
            const loc = {
                address: location.address, 
                latitude: response.json.results[0].geometry.location.lat,
                longitude: response.json.results[0].geometry.location.lng
            };

            const business = new Business({ name, type, contact, image, stars, popularity, totalReviews, location: loc});

            business
            .save() // returns a promise
            .then(function(business) {
                res.status(201).json(business);
            })
            .catch(function(error) {
                res.status(500).json({
                    error: 'There was an error while saving the Business to the Database. (' + error + ')'
                });
            });
        })
        .catch((err) => {
            console.log(err);
        });
};

const getBusinessByName = (request, response) => {
  const { name } = request.params;
  console.log("Getting Business: " + name);
  Business.findOne({ name: name })
    .then(business => {
      if (business) {
        response.status(200).json(business);
      } else {
        response.status(400).json({
          error: "Business not found."
        });
      }
    })
    .catch(function(error) {
      response.status(500).json({
        error:
          "The business information could not be retrieved. (" + error + ")"
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
        error: "The information could not be retrieved."
      });
    });
};

const deleteBusinessById = (request, response) => {
  const { id } = request.params;

  Business.findByIdAndRemove(id)
    .then(function(business) {
      response.status(200).json(business);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The business could not be removed."
      });
    });
};

const getAllBusiness = (request, response) => {
  Business.find({})
    .then(function(businessList) {
      response.status(200).json(businessList);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The information could not be retrieved."
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
