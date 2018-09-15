const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  name: String,
  type: String,
  contact: String,
  image: String,
  stars: Number,
  popularity: Boolean,
  totalReviews: Number,  
  location: {
    address: String,
    longitude: Number,
    latitude: Number
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
