const Business = require("../models/business");
const googleMapsClient = require("@google/maps").createClient({
  key: process.env.REACT_APP_GOOGLEPLACESKEY || process.env.googlePlaces,
  Promise: Promise,
});

const createBusiness = (req, res) => {
  googleMapsClient
    .place({ placeid: req.body.id })
    .asPromise()
    .then(response => {
      let result = response.json.result;
      let name = result.hasOwnProperty("name") ? result.name : "No Name Listed";
      let types = result.hasOwnProperty("types") ? result.types : "No Types Listed";
      let address = result.hasOwnProperty("formatted_address") ? result.formatted_address : "No Address Listed";
      let phone = result.hasOwnProperty("formatted_phone_number")
        ? result.formatted_phone_number
        : "No Phone Number Listed";
      let images = result.hasOwnProperty("iamges") ? result.images : "No Images Listed";
      let website = result.hasOwnProperty("website") ? result.website : "No Website Listed";
      let hours = result.hasOwnProperty("opening_hours") ? result.opening_hours : "No Hours Listed";
      let description = result.hasOwnProperty("description")
        ? result.address_components.long_name
        : "No Description Listed";
      const business = new Business({
        name,
        types,
        address,
        phone,
        images,
        website,
        place_id: result.place_id,
        hours,
        description,
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

createPhotoMarker = photo => {
  var photos = place.photos;
  if (!photos) {
    return;
  }

  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    title: place.name,
    icon: photos[0].getUrl({ maxWidth: 35, maxHeight: 35 }),
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
  Business.findOne({ name: name })
    .then(business => {
      if (business) {
        response.status(200).json(business);
      } else {
        response.status(400).json({
          error: "Business not found.",
        });
      }
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The business information could not be retrieved. (" + error + ")",
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
        error: "The information could not be retrieved.",
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
        error: "The business could not be removed.",
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
        error: "The information could not be retrieved.",
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
