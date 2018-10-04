
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
  const { username, password, email } = request.body;
  const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
  const token = generateToken({ username });
  const user = new User({ username, password: encryptedPassword, token, email });
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

  User.findOne({ username: username }).then(userFound => {
    if (!userFound) {
      response.status(500).send({
        errorMessage: "Login Failed.",
      });
    } else {
      if (bcrypt.compareSync(password, userFound.password)) {
        const token = generateToken({ userFound });
        const { _id } = userFound;
        console.log("Token", token)
        console.log("UserId", _id)
        console.log("UserId", userFound)
        response.status(200).send({ username: userFound.username, name: userFound.name, token, userId: _id  });
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

const deleteUserById = (request, response) => {
  const { _id } = request.body;
  User.findByIdAndRemove({ _id: request.params._id })
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be removed.",
      });
    });
};

const updateUser = (request, response) => { 
  const { _id, username, email } = request.body;  
  User.findById({ _id: request.params.id })  
  .then(function(user) {  
    if (user) {   
         user.username = username, user.email = email;       
          User.findByIdAndUpdate( { _id: request.params.id }, user).then(user => { 
           response.status(200).json(user)
         }).catch(err => {           
          response.status(500).json(`message: Error username or email: ${err}`)
         })
         }
  })
  .catch(function(error){
    response.status(500).json(`message: Error username or email: ${error}`)
    })
}

const getAllUsers = (request, response) => {
  User.find({})
    .then(function(userList) {
      response.status(200).json(userList);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The users could not be found.",
      });
    });
};

const reset_password = function(request, response) {
  console.log("Fire password")
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
    response.status(500).json(`message: Error reseting password: ${error}`)
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
};
