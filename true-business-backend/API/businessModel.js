const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  business: {
    name: String,
    type: String,
    contact: String,
    // image: String,
    // stars: Number,
    // popularity: Boolean,
    // totalReviews: Number,
    required: true
  },
  createdOn: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

const Business = mongoose.model('Business', businessSchema);

module.exports = Business;
