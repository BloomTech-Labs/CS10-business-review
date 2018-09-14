const bcrypt = require('bcrypt');
const User = require('../models/user');
//const Validator = require("email-validator");
const bcryptRounds = 10;

const register = (request, response) => {
    const { username, password, email } = request.body;

    // Check for empty username, password or email.
    if(!username.trim() || !password.trim() || !email.trim()) {
        response.status(400).send({
            errorMessage: "Missing username, password or email."
        });
        return;
    }
 
    /* Sophie: REMOVED Until I figure out how to make it work.
    if(!Validator.validate(email)) {
        response.status(400).send({
            errorMessage: "Email is not valid."
        });
        return;
    }*/

    // Check to see if the user exists.
    User
    .findOne({
            $or:[
                { "username": username},
                { "email": email} 
            ]}
    ).then(userFound => {
        if(userFound) {
            response.status(500).send({
                errorMessage: "User name or email already exists."
            });
        } else {
            // Create User.
            const encryptedPassword = bcrypt.hashSync(password, bcryptRounds);
            const user = new User({username, password:encryptedPassword, email});
            user.save()
                .then(savedUser => {
                    response.status(200).send(savedUser);
                })
                .catch(err => {
                    response.status(500).send({
                        errorMessage: "Error occurred while saving: " + err
                    });
                });
        }
    })
};

const login = (request, response) => {
    const { username, password } = request.body;

    User.findOne({ "username": username}).then(userFound => {
        if(!userFound) {
            response.status(500).send({
                errorMessage: "Login Failed."
            });
        } else {
            if(bcrypt.compareSync(password, userFound.password)) {
                response.status(200).send({username: userFound.username});
            } else {
                response.status(500).send({
                    errorMessage: "Login Failed."
                });
            }
        }
    })
};

const getUserById = (request, response) => {
    const { id } = request.params;

    User
        .findById(id)
        .then(function(user) {
            response.status(200).json(user);
        })
        .catch(function(error) {
            response.status(500).json({ 
                error: 'The user could not be retrieved.' 
            });
        });
};

const deleteUserById = (request, response) => {
    const { id } = request.params;

    User
        .findByIdAndRemove(id)
        .then(function(user) {
            response.status(200).json(user);
        })
        .catch(function(error) {
            response.status(500).json({ 
                error: 'The user could not be removed.' 
            });
        });       
};

const getAllUsers = (request, response) => {

    User
        .find({})
        .then(function(userList) {
            response.status(200).json(userList);
        })
        .catch(function(error) {
            response.status(500).json({ 
                error: 'The users could not be found.' 
            });
        });
};

module.exports = {
    register,
    login,
    getUserById,
    deleteUserById,
    getAllUsers
};