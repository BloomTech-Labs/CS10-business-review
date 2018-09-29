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
      let formatted_address = result.hasOwnProperty("formatted_address")
        ? result.formatted_address
        : "No Address Listed";
      let formatted_phone_number = result.hasOwnProperty("formatted_phone_number")
        ? result.formatted_phone_number
        : "No Phone Number Listed";
      let website = result.hasOwnProperty("website") ? result.website : "No Website Listed";
      let photos = result.hasOwnProperty("photos") ? result.photos : "No Photos Listed";
      if (photos !== "No Photos Listed") {
        googleMapsClient
          .placesPhoto({
            photoreference: photos[0].photo_reference,
            maxwidth: 10000,
          })
          .asPromise()
          .then(photo => {
            photos = [photo];
          })
          .catch(err => {
            photos = ["Error Returning Photo"];
          });
      }
      let opening_hours = result.hasOwnProperty("opening_hours") ? result.opening_hours : "No Hours Listed";
      let address_components = result.hasOwnProperty("address_components")
        ? result.address_components
        : "No Description Listed";
      const business = new Business({
        name,
        types,
        formatted_address,
        formatted_phone_number,
        photos,
        website,
        place_id: result.place_id,
      });
      business
        .save()
        .then(business => {
          res.status(201).json(business);
        })
        // May be bad pratice, but if it fails to create a business because it
        // already exists it will then find the business and send that instead
        .catch(error => {
          Business.find({ place_id: business.place_id })
            .then(response => {
              res.status(200).json(response[0]);
            })
            .catch(error => {
              res.status(500).json({ error });
            });
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
      let promises = response.json.results.map(result => {
        let photos = result.hasOwnProperty("photos") ? result.photos : "No Photos Listed";
        if (photos !== "No Photos Listed") {
          return new Promise(resolve => {
            return resolve(
              googleMapsClient
                .placesPhoto({
                  photoreference: photos[0].photo_reference,
                  maxwidth: 10000,
                })
                .asPromise()
                .then(photo => {
                  let html = ["https://" + photo.req.socket._host + photo.req.path];
                  result.photos = html;
                  return result;
                }),
            );
          });
        }
        return new Promise(resolve => resolve(result));
      });
      Promise.all(promises)
        .then(places => {
          res.status(200).json(places);
        })
        .catch(error => res.status(500).json("Better not be...", error));
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
      let photos = response.json.result.hasOwnProperty("photos") ? response.json.result.photos : "No Photos Listed";
      if (photos !== "No Photos Listed") {
        googleMapsClient
          .placesPhoto({
            photoreference: photos[0].photo_reference,
            maxwidth: 10000,
          })
          .asPromise()
          .then(photo => {
            photos = ["https://" + photo.req.socket._host + photo.req.path];
            response.json.result.photos = photos;
            res.status(200).json(response.json.result);
          })
          .catch(err => {
            console.log("Error Getting Photo!", err);
            res.send(venue);
          });
      }
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
