const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
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
      callbackURL: "/auth/google/redirect",
      clientID: process.env.googleClientID || process.env.REACT_APP_GOOGLEAUTHCLIENTID,
      clientSecret: process.env.googleClientSecret || process.env.REACT_APP_GOOGLEAUTHSECRET,
    },
    (accessToken, refreshToken, profile, done) => {
      User.findOne({
        $or: [{ "id": profile.id }, { "email": profile.emails[0].value }],
      })
        .then(existingUser => {
          if (existingUser) {
            console.log("Found Existing user...");
            existingUser.google_id = profile.id;
            existingUser.username = profile.displayName;
            existingUser.email = profile.emails[0].value;
            existingUser.userImages = [
              {
                link: profile._json.image.url,
                width: 3024,
                height: 4032,
              },
            ];
            existingUser.save();
            done(null, existingUser);
          } else {
            console.log("New User...");
            let newUser = new User({
              google_id: profile.id,
              email: profile.emails[0].value,
              username: profile.emails[0].value,
              name: profile.displayName,
              userImages: [
                {
                  link: profile._json.image.url,
                  width: 3024,
                  height: 4032,
                },
              ],
            });
            newUser.save().then(newUser => {
              done(null, newUser);
            });
          }
        })
        .catch(err => {
          done(err, false, err.message);
        });
    },
  ),
);