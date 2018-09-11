const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  business: {
    name: String,
    type: String,
    image: String,
    stars: Number,
    contact: String,
    popularity: Boolean,
    totalReviews: Number,
    required: true
  }
  createdOn: {
    type: Date,
    required: true,
    default: Date.now()
  }
});

const Business = mongoose.model('Business', businessSchema);

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

module.exports = Business;
