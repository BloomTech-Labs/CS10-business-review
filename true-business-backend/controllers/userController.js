const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const options = {
    expiresIn: "1h",
  };
  const payload = { name: user.username };
  secret = process.env.REACT_APP_SECRET;
  if (typeof secret !== "string") {
    secret = process.env.secret;
  }
  return jwt.sign(payload, secret, options);
}

const bcryptRounds = 10;

const register = (request, response) => {
  const { name, username, password, email, accountType } = request.body;
  const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
  const token = generateToken({ username });
  const user = new User({ accountType, name, username, password: encryptedPassword, token, email });
  user
    .save()
    .then(savedUser => {
      response.status(200).send(savedUser);
    })
    .catch(err => {
      response.status(500).send({
        errorMessage: "Error occurred while saving: " + err,
      });
    });
};

const login = (request, response) => {
  const { username, password } = request.body;
  User.findOne({ username: username })
    .then(userFound => {
      if (!userFound) {
        response.status(500).send({
          errorMessage: "Login Failed.",
        });
      } else {
        if (bcrypt.compareSync(password, userFound.password)) {
          const token = generateToken({ userFound });
          response.status(200).send({ ...userFound, token });
        } else {
          response.status(500).send({
            errorMessage: "Login Failed.",
          });
        }
      }
    })
  .catch(err => {
    response.status(500).send({
      errorMessage: "Failed to Login: " + err,
    });
  });
};

const getUserById = (request, response) => {
  User.findById({_id:request.params.id})
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be retrieved.",
      });
    });
};

const getRandomUser = (request, response) => {
  User.count().exec(function (err, count) {
    const random = Math.floor(Math.random() * count);
    User.findOne().skip(random)
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be retrieved.",
      });
    });
  });
};

const deleteUserById = (request, response) => {
  const { _id } = request.body;

  User.findByIdAndRemove(_id)
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be removed.",
      });
    });
  }

const updateUser = (request, response) => {
  const { _id, username, email } = request.body;
 User.findOneAndUpdate(_id, {username, email})
 .then(function(user) {
   response.status(200).json(user);
 })
 .catch(function(error){
   response.status(500).json({
  errorMessage: "The user could not be updated: " + error
   })
 })
}

const getAllUsers = (request, response) => {
  User.find({})
    .then(function(users) {
      let featured = [];
      let reviews = 100;
      // While we don't have 4 featured users
      // When we get likes going, do the same thing we did in businessController
      while (featured.length < 4 && reviews >= 0) {
        // While we have an empty DB this may be slow...
        users.forEach(user => {
          if (user.numberOfReviews > reviews && !featured.includes(user)) {
            featured.push(user);
          }
        });
        reviews -= 10;
      }
      response.status(200).json(featured);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The information could not be retrieved.",
      });
    });
};


const reset_password = function(request, response) {
  const { _id, password, newPassword, verifyPassword } = request.body;  
  User.findById({ _id: request.params._id })  
  .then(function(user) {    
    if (user) {
      if (bcrypt.compareSync(password, user.password)) {
       if (newPassword === verifyPassword) {
         user.password = bcrypt.hashSync(newPassword, bcryptRounds);              
         User.findByIdAndUpdate( { _id: request.params._id }, user).then(user => {         
           response.status(200).json(user)
         }).catch(err => {           
          response.status(500).json(`message: Error reseting password: ${err}`)
         })        
      }
    } 
  }
  })
  .catch(function(error){
    res.status(500).json(`message: Error reseting password: ${error}`)
    })
}

module.exports = {
  register,
  login,
  getUserById,
  deleteUserById,
  updateUser,
  getAllUsers,
  reset_password,
  getRandomUser
};
