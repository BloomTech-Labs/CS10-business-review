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
  const { _id } = request.body;

  User.findOne(_id)
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

const updateUser = (req, res) => {
  let updateType = null;
  if (req.body.hasOwnProperty("email")) updateType = "email";
  if (req.body.hasOwnProperty("username")) updateType = "username";
  if (req.body.hasOwnProperty("password")) updateType = "password";
  User.findOne({ _id: req.params.id })
    .then(found => {
      if (updateType === "password") {
        const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
        const token = generateToken({ username });
        found[updateType] = req.body;
      } else {
        found[updateType] = req.body;
      }
      User.findOneAndUpdate({ _id: req.params.id }, found)
        .then(function(user) {
          response.status(200).json(user);
        })
        .catch(function(error) {
          response.status(500).json({
            errorMessage: "The user could not be updated: " + error,
          });
        });
    })
    .catch(error => {
      console.log("Error", error);
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
  updateUser,
  getAllUsers,
  getRandomUser
};
