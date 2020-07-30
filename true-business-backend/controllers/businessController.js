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
      let rating = result.hasOwnProperty("rating") ? result.rating : "No Rating Listed";
      let website = result.hasOwnProperty("website") ? result.website : "No Website Listed";
      let photos = result.hasOwnProperty("photos") ? result.photos : null;
      let opening_hours = result.hasOwnProperty("opening_hours") ? result.opening_hours : "No Hours Listed";
      let address_components = result.hasOwnProperty("address_components")
        ? result.address_components
        : "No Description Listed";
      let promises = [];
      if (photos !== "No Photos Listed") {
        promises = result.photos.map((photo, i) => {
          return new Promise(resolve => {
            return resolve(
              googleMapsClient
                .placesPhoto({
                  photoreference: photo.photo_reference,
                  maxwidth: 1000,
                  maxheight: 500,
                })
                .asPromise()
                .then(photo => {
                  let imgObject = {
                    link: "https://" + photo.req.socket._host + photo.req.path,
                    width: photos[i].width,
                    height: photos[i].height,
                  };
                  return imgObject;
                }),
            );
          });
        });
      }
      Promise.all(promises)
        .then(images => {
          const business = new Business({
            name,
            types,
            formatted_address,
            formatted_phone_number,
            website,
            photos: images,
            opening_hours,
            address_components,
            place_id: result.place_id,
            rating,
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
        .catch(error => res.status(500).json("Error Getting Photos", error));
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
                  maxwidth: 1000,
                  maxheight: 500,
                })
                .asPromise()
                .then(photo => {
                  return new Promise(resolve => {
                    return resolve(
                      Business.findOne({ place_id: result.place_id })
                        .then(found => {
                          let imgObject = [
                            {
                              link: "https://" + photo.req.socket._host + photo.req.path,
                              width: photos[0].width,
                              height: photos[0].height,
                            },
                          ];
                          if (found) {
                            found.photos = imgObject;
                            return found;
                          } else {
                            result.stars = 0;
                            result.photos = imgObject;
                            return result;
                          }
                        })
                        .catch(error => {
                          console.log({ error });
                        }),
                    );
                  });
                })
                .catch(error => {
                  console.log({ error });
                }),
            );
          });
        }
        result.photos = "No Photos Listed";
        return new Promise(resolve => resolve(result));
      });
      Promise.all(promises)
        .then(places => {
          places = places.filter(place => {
            return !place.hasOwnProperty("permanently_closed");
          });
          res.status(200).json(places);
        })
        .catch(error => res.status(500).json("Error Getting Photos", error));
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
      let result = response.json.result;
      result.name = result.hasOwnProperty("name") ? result.name : "No Name Listed";
      result.types = result.hasOwnProperty("types") ? result.types : "No Types Listed";
      result.formatted_address = result.hasOwnProperty("formatted_address")
        ? result.formatted_address
        : "No Address Listed";
      result.formatted_phone_number = result.hasOwnProperty("formatted_phone_number")
        ? result.formatted_phone_number
        : "No Phone Number Listed";
      result.rating = result.hasOwnProperty("rating") ? result.rating : "No Rating Listed";
      result.website = result.hasOwnProperty("website") ? result.website : "No Website Listed";
      result.photos = result.hasOwnProperty("photos") ? result.photos : "No Photos Listed";
      result.opening_hours = result.hasOwnProperty("opening_hours") ? result.opening_hours : "No Hours Listed";
      result.address_components = result.hasOwnProperty("address_components")
        ? result.address_components
        : "No Description Listed";
      if (result.photos !== "No Photos Listed") {
        googleMapsClient
          .placesPhoto({
            photoreference: result.photos[0].photo_reference,
            maxheight: 500,
            maxwidth: 1000,
          })
          .asPromise()
          .then(photo => {
            let imgObject = [
              {
                link: "https://" + photo.req.socket._host + photo.req.path,
                width: result.photos[0].width,
                height: result.photos[0].height,
              },
            ];
            result.photos = imgObject;
            res.status(200).json(result);
          })
          .catch(err => {
            console.log("Error Getting Photo!", err);
          });
      } else {
        res.status(200).json(result);
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

const getBusinessByGoogleId = (request, response) => {
  const { id } = request.params;
  Business.findOne({  place_id: id })
    .then(function(business) {
      response.status(200).json(business);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The information could not be retrieved.",
      });
    });
};

const getRandomBusiness = (request, response) => {
  Business.count().exec(function(err, count) {
    const random = Math.floor(Math.random() * count);
    Business.findOne()
      .skip(random)
      .then(function(business) {
        response.status(200).json(business);
      })
      .catch(function(error) {
        response.status(500).json({
          error: "The business could not be retrieved.",
        });
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

// const getAllBusiness = (request, response) => {
//   Business.find({})
//     .then(function(businessList) {
//       response.status(200).json(businessList);
//     })
//     .catch(function(error) {
//       response.status(500).json({
//         error: "The information could not be retrieved.",
//       });
//     });
// };

const getAllBusiness = (request, response) => {
  Business.find({})
    .then(function(businessList) {
      let featured = [];
      let stars = 5;
      let reviews = 100;
      let flag = false;
      // While we don't have 4 featured business
      while (featured.length < 4 && stars >= 0 && reviews >= 0) {
        // Get Ideally 5 stars & 100 Reviews
        // Then 4 stars & 100 Reviews
        // ...
        // Worst Case 0 stars & 0 Reviews
        // While we have an empty DB this may be slow...
        businessList.forEach(business => {
          if (business.stars >= stars && business.totalReviews >= reviews && !featured.includes(business)) {
            featured.push(business);
          }
        });
        if (flag === false && stars === 0) {
          stars = 5;
          reviews -= 20;
          flag = true;
        } else {
          stars -= 1;
          flag = false;
        }
      }
      response.status(200).json(featured);
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
  getBusinessByGoogleId,
  deleteBusinessById,
  getAllBusiness,
  placesSearch,
  placeSearch,
  getRandomBusiness,
};
