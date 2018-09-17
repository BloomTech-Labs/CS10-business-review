const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");
const mongoose = require("mongoose");
const keys = require("../config/keys");

passport.initialize();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.googleClientID || keys.googleAuthClientID,
      clientSecret: process.env.googleClientSecret || keys.googleAuthSecret,
      callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(accessToken);
      console.log(profile);
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        return done(null, existingUser);
      }

      const user = await new User({ googleId: profile.id }).save();
      done(null, user);
    }
  )
);
