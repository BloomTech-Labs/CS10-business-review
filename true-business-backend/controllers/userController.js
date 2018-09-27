const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");




function generateToken(user) {
  const options = {
    expiresIn: "1h",
  };
  const payload = { name: user.username };
  return jwt.sign(payload, process.env.REACT_APP_SECRET, options);
}

const bcryptRounds = 10;

const register = (request, response) => {
  const { username, password } = request.body;
  const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
  const token = generateToken({ username });
  const user = new User({ username, password: encryptedPassword, token });
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
        response.status(200).send({ username: userFound.username, token, userId: _id  });
      } else {
        response.status(500).send({
          errorMessage: "Login Failed.",
        });
      }
    }
  })
  .catch(err => {
    console.log("Error-Login", err)
    response.status(500).send({
      errorMessage: "Failed to Login: " + err,
    });
  });
};

const getUserById = (request, response) => {
  const { _id } = request.body;

  User.findById(_id)
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

  User.findByIdAndRemove(_id)
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
  const { _id } = request.body;
 User.findByIdAndUpdate(_id)
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
    .then(function(userList) {
      response.status(200).json(userList);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The users could not be found.",
      });
    });
};

module.exports = {
  register,
  login,
  getUserById,
  deleteUserById,
  updateUser,
  getAllUsers,
};
