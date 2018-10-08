const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

function generateToken(user) {
  const options = {
    expiresIn: "1h",
  };
  console.log("1");
  const payload = { name: user.username };
  console.log("2");
  secret = process.env.REACT_APP_SECRET;
  console.log("3");
  if (typeof secret !== "string") {
    secret = process.env.secret;
  }
  console.log("4");
  return jwt.sign(payload, secret, options);
}

const bcryptRounds = 10;

const register = (request, response) => {
  const { name, username, password, email, accountType } = request.body;
  if (!name || !username || !email || !password) {
    response.status(400).json({ errorMessage: "Please provide a name, username, email, and password!" });
  }
  User.findOne({ username })
    .then(user => {
      if (user) {
        response.status(401).json({ errorMessage: "This username already exists" });
      } else {
        const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
        const token = generateToken({ username });
        const user = new User({ accountType, name, username, password: encryptedPassword, token, email });
        user
          .save()
          .then(savedUser => {
            response.status(200).send(savedUser);
          })
          .catch(err => {
            response.status(500).json({
              errorMessage: "Error occurred while saving: " + err,
            });
          });
      }
    })
    .catch(err => {
      response.status(500).json({
        errorMessage: "Something went wrong: " + err,
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

const createGoogleUser = (req, res) => {
  const { name, email, googleId, imageUrl } = req.body.google;
  console.log("shit?", googleId)
  User.findOne({ googleId })
    .then(user => {
      if (user) {
        console.log("piss?")
        res.status(401).json({ errorMessage: "This Google Account is Already Registered." });
      } else {
        const token = generateToken({ name,email });
        console.log("cunt?")
        const user = new User({
          name,
          username: name,
          token,
          email,
          userImages: [
            {
              link: imageUrl,
              width: 0,
              height: 0,
            },
          ],
        });
        console.log("EHHHH?")
        user
          .save()
          .then(savedUser => {
            console.log("PUHLLLLLLLLEEEEEEEZE")
            res.status(200).send(savedUser);
          })
          .catch(err => {
            res.status(500).json({
              errorMessage: "Error occurred while saving: " + err,
            });
          });
      }
    })
    .catch(err => {
      res.status(500).json({
        errorMessage: "Something went wrong: " + err,
      });
    });
};

const getGoogleUser = (request, response) => {
  User.findOne({ googleId: request.body.google.googleId })
    .then(userFound => {
      const token = generateToken({ userFound });
      response.status(200).send({ ...userFound, token });
    })
    .catch(error => {
      response.status(500).json({
        error: "The user could not be retrieved.",
      });
    });
};

const getUserById = (request, response) => {
  User.findById({ _id: request.params.id })
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
  User.count().exec(function(err, count) {
    const random = Math.floor(Math.random() * count);
    User.findOne()
      .skip(random)
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
  User.findById({ _id: request.params.id })
    .then(function(user) {
      if (user) {
        if (request.body.field === "password") {
          if (bcrypt.compareSync(request.body.update.password, user.password)) {
            user.password = bcrypt.hashSync(request.body.update.passwordUpdate, bcryptRounds);
          } else {
            return response.status(500).json({ "Error Updating Password": error });
          }
        } else {
          user[request.body.field] = request.body.update;
        }
        User.findByIdAndUpdate({ _id: request.params.id }, user, { new: true })
          .then(user => {
            response.status(200).json(user);
          })
          .catch(err => {
            response.status(500).json({ "Error Updating Username or Email": error });
          });
      }
    })
    .catch(function(error) {
      response.status(500).json({ "Error Updating User": error });
    });
};

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

module.exports = {
  register,
  login,
  getUserById,
  deleteUserById,
  updateUser,
  getAllUsers,
  getRandomUser,
  getGoogleUser,
  createGoogleUser,
};
