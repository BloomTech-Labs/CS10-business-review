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
        response.status(200).send({ username: userFound.username, token });
      } else {
        response.status(500).send({
          errorMessage: "Login Failed.",
        });
      }
    }
  });
};

const getUserById = (request, response) => {
  const { id } = request.params;

  User.findById(id)
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
  const { id } = request.params;

  User.findByIdAndRemove(id)
    .then(function(user) {
      response.status(200).json(user);
    })
    .catch(function(error) {
      response.status(500).json({
        error: "The user could not be removed.",
      });
    });
};

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
  getAllUsers,
};
