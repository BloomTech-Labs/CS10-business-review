const Business = require('../models/business');
const googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDDwj-ds3jn5qKAo0WUPeT6USveLRurAng',
  Promise: Promise,
});

const createBusiness = (req, res) => {
  googleMapsClient
    .place({ placeid: req.body.id })
    .asPromise()
    .then(response => {
      let result = response.json.result;
      const business = new Business({
        name: result.name,
        types: result.types,
        address: result.formatted_address,
        phone: result.formatted_phone_number,
        website: result.website,
        images: result.photos[0],
        googleID: result.place_id,
        hours: result.opening_hours.weekday_text,
        description: result.address_components.long_name,
        location: result.geometry.location,
      });
      business
        .save()
        .then(business => {
          res.status(201).json(business._id);
        })
        .catch(error => {
          res.status(500).json({ error });
        });
    })
    .catch(error => {
      console.log({ error });
    });
};

const placesSearch = (req, res) => {
  googleMapsClient
    .places({ query: req.body.query })
    .asPromise()
    .then(response => {
      res.status(200).json(response.json.results);
    })
    .catch(error => {
      console.log({ error });
    });
};

const placeSearch = (req, res) => {
  googleMapsClient
    .place({ placeid: req.body.id })
    .asPromise()
    .then(response => {
      res.status(200).json(response.json.result);
    })
    .catch(error => {
      console.log({ error });
    });
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
          error: 'Business not found.',
        });
      }
    })
    .catch(function(error) {
      response.status(500).json({
        error: 'The business information could not be retrieved. (' + error + ')',
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
        error: 'The information could not be retrieved.',
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
        error: 'The business could not be removed.',
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
        error: 'The information could not be retrieved.',
      });
    });
};

module.exports = {
  createBusiness,
  getBusinessByName,
  getBusinessById,
  deleteBusinessById,
  getAllBusiness,
  placesSearch,
  placeSearch,
};
