const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

const googleStrategy = new GoogleStrategy(
  {
    callbackURL: "/auth/google/redirect",
    clientID: process.env.REACT_APP_GOOGLEAUTHCLIENTID,
    clientSecret: process.env.REACT_APP_GOOGLEAUTHSECRET
  },
  (accessToken, refreshToken, profile, done) => {
    User.findOne({
      $or: [
        { "google.id": profile.id },
        { "local.email": profile.emails[0].value }
      ]
    })
      .then(existingUser => {
        if (existingUser) {
          if (existingUser.google.id == undefined) {
            existingUser.google.id = profile.id;
            existingUser.google.username = profile.displayName;
            existingUser.google.email = profile.emails[0].value;
            existingUser.google.thumbnail = profile._json.image.url;
            existingUser.save();
          }
          done(null, existingUser);
        } else {
          let newUser = new User({
            method: "google",
            google: {
              id: profile.id,
              email: profile.emails[0].value,
              username: profile.displayName
            }
          });
          newUser.local.email = profile.emails[0].value;
          newUser.local.username = profile.displayName;
          newUser.verified = true;
          newUser.save().then(newUser => {
            done(null, newUser);
          });
        }
      })
      .catch(err => {
        done(err, false, err.message);
      });
  }
);
