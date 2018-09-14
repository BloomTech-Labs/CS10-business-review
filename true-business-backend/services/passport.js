const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID || keys.googleAuthClientID,
      clientSecret: process.env.googleClientSecret || keys.googleAuthSecret,
      callbackURL: '/auth/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      console.log('access token', accessToken);
      console.log('refresh token', refreshToken);
      console.log('profile', profile);
    }
  )
);
