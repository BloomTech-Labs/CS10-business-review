const passport = require("passport");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const User = require("../models/user");

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        process.env.googleClientID || process.env.REACT_APP_GOOGLEAUTHCLIENTID,
      clientSecret:
        process.env.googleClientSecret ||
        process.env.REACT_APP_GOOGLEAUTHSECRET,
      callbackURL: "http://localhost:3001/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log("fire", profile.emails[0].value);
        const existingUser = await User.findOne({ googleId: profile.id });
        if (existingUser) {
          return done(null, existingUser);
        }
        const email = profile.emails[0].value;
        const user = await new User({
          googleId: profile.id,
          name: profile.displayName,
          email: email,
          username: email
        }).save();
        done(null, user);
      } catch (error) {
        console.log({ error });
      }
    }
  )
);
