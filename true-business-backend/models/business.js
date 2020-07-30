const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  // places_details: name
  // returns a formatted string
  name: {
    type: String,
    required: true,
  },
  // places_details: types
  // returns an array of strings
  types: [
    {
      type: String,
    },
  ],
  // places_details: formatted_address
  // returns a formatted string
  formatted_address: {
    type: String,
    required: true,
  },
  // places_details: formatted_phone_number
  // returns a formatted string
  formatted_phone_number: {
    type: String,
    required: true,
  },
  // places_details: website
  // Some restaurants don't have a website, no required
  website: {
    type: String,
  },
  // places_details: photos
  // returns an array of objects
  // Unlikely, but possible there won't be any, no required
  photos: {
    type: Array,
    default: [
      {
        link: "https://png.icons8.com/ios/100/000000/organization.png",
        width: 100,
        height: 100,
      },
    ],
  },
  // places_details: place_id
  // returns a string
  place_id: {
    type: String,
    required: true,
  },
  // places_details: opening_hours/weekday_text
  // returns an array of seven strings
  opening_hours: {
    type: Object,
  },
  // places_details: address_components/long_name
  // Not 100% about this one, but I believe it is what we are looking for
  // returns full text description supposedly (or name of address component?)
  address_components: {
    type: Object,
  },
  // aggregate (may be the wrong word...) number thus far from the reviews
  // Ex. two reviews, 1 star and 5 star, this number would be 3
  // When new review is added, this is calculated; grab the number of reviews, increment that by 1
  // grab the stars, add the star rating from the new review to this rating, divide by 2
  stars: {
    type: Number,
    default: 0,
  },
  // Just the total number of reviews on this business.  I would assume it would be as simple
  // as updating the business each time a new review has been posted.
  // Alternatively, we could probably just do business.reviews.length or something on the
  // front end whenever calculating stars / popularity.
  totalReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  // For the map object that will be placed on the business page.
  location: {
    type: Object,
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  updatedOn: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  popularity: {
    type: Boolean,
    required: true,
    default: false,
  },
  rating: {
    type: Number,
    default: 0,
  }
});

let businessModel = mongoose.model('Business', businessSchema);

// Pre-save hook
businessSchema.pre('save', function(next) {
  businessModel.find({ place_id: this.place_id }, (err, docs) => {
    if (!docs.length) {
      next();
    } else {
      console.log('Business exists already');
      next(new Error('Business exists!'));
    }
  });
});

// // Post-save hook
// // This is where we update the net promotor score or whatever
// businessSchema.pre('save', function(next) {
// });

module.exports = businessModel;
