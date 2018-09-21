const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Refers to whether they are "Monthly" or "Yearly"
  accountType: {
    type: String,
    requied: true,
  },
  // The date the account is activated
  accountActivated: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  // presave hook will change this by a month or year
  accountDeactivated: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  // For old-school way of registering I presume
  email: {
    type: String,
    unique: true,
  },
  // Displayed on reviews and what not
  username: {
    type: String,
    unique: true,
    default: 'User' + (Math.floor(Math.random() * 1000000000) + 123456),
  },
  // Guessing also only necessary for old-school way of registering
  password: {
    type: String,
  },
  // For google passport
  googleId: {
    type: String,
  },
  reviews: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
  numberOfReviews: {
    type: Number,
    required: true,
    default: 0,
  },
  numberOfLikes: {
    type: Number,
    required: true,
    default: 0,
  },
  userImage: {
    type: String,
  },
});

// Pre-save hook
userSchema.pre('save', (doc, next) => {
  console.log('SHITTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT');
  if (this.accountType === 'oneMonth') {
    console.log('WOOT MOFO');
  }
  console.log('BALLS MOFO', doc);
  next();
});

module.exports = mongoose.model('User', userSchema);
