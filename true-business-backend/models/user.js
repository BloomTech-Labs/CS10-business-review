const mongoose = require('mongoose');

<<<<<<< HEAD
const userSchema = new mongoose.Schema(
  // username: {
  //   type: String,
  //   required: true
  // },
  // password: {
  //   type: String,
  //   required: true
  // },
  {
    googleId: String
  }
);
=======
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    }

});
>>>>>>> b88106a9cda71530c7e0c895a3efafb1b5869660

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;
