const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID,
      clientSecret: process.env.googleClientSecret,
      callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      console.log(accessToken);
      console.log(accessToken);
      console.log(accessToken);
    }
  )
);

module.exports = {
  passport
};
