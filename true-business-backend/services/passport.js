const jwt = require("jsonwebtoken");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const JwtStrategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

require("dotenv").config();

const { ROOT_URL } = require("./root-urls.js");
const Subscriber = require("../models/subscriber");
const secret = process.env.REACT_APP_SECRET;

// Local Strategy
const localStrategy = new LocalStrategy({ subscribernameField: "email" }, function(
  email,
  subscribername,
  password,
  done
) {
  // Use async function for awaiting promise in subscriber.validPassword
  Subscriber.findOne({ "local.email": email }, async function(err, subscriber) {
    if (err) return done(err);
    if (!subscriber) {
      return done(null, false);
    }
    if (!(await subscriber.validPassword(password))) {
      return done(null, false);
    }
    if (!subscriber.verified) {
      return done({ message: "Sorry, you must validate email first" }, false);
    }
    return done(null, subscriber);
  });
});

<<<<<<< HEAD
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secret
};

// Passport strategy for securing RESTful endpoints using JWT
const jwtStrategy = new JwtStrategy(jwtOptions, (payload, done) => {
  Subscriber.findById(payload.sub)
    .select("-password")
    .then(subscriber => {
      if (subscriber) {
        done(null, subscriber);
      } else {
        done(null, false);
      }
    })
    .catch(err => {
      done(err, false);
    });
});

// Google OAuth Strategy
const googleStrategy = new GoogleStrategy(
  {
    callbackURL: "/auth/google/redirect",
    clientID: process.env.REACT_APP_GOOGLEAUTHCLIENTID,
    clientSecret: process.env.REACT_APP_GOOGLEAUTHSECRET
  },
  (accessToken, refreshToken, profile, done) => {
    Subscriber.findOne({
      $or: [
        { "google.id": profile.id },
        { "local.email": profile.emails[0].value }
      ]
    })
      .then(existingSubscriber => {
        if (existingSubscriber) {
          if (existingSubscriber.google.id == undefined) {
            existingSubscriber.google.id = profile.id;
            existingSubscriber.google.subscribername = profile.displayName;
            existingSubscriber.google.email = profile.emails[0].value;
            existingSubscriber.google.thumbnail = profile._json.image.url;
            existingSubscriber.save();
          }
          done(null, existingSubscriber);
        } else {
          let newSubscriber = new Subscriber({
            method: "google",
            google: {
              id: profile.id,
              email: profile.emails[0].value,
              subscribername: profile.displayName,
              thumbnail: profile._json.image.url
            }
          });
          newSubscriber.local.email = profile.emails[0].value;
          newSubscriber.local.subscribername = profile.displayName;
          newSubscriber.verified = true;
          newSubscriber.save().then(newSubscriber => {
            done(null, newSubscriber);
          });
        }
      })
      .catch(err => {
        done(err, false, err.message);
      });
  }
);

const facebookStrategy = new FacebookStrategy(
  {
    callbackURL: "/auth/facebook/callback",
    clientID: process.env.REACT_APP_FB_CLIENT_ID,
    clientSecret: process.env.REACT_APP_FB_CLIENT_SECRET,
    profileFields: ["id", "displayName", "name", "gender", "photos", "email"]
  },
  (accessToken, refreshToken, profile, done) => {
    Subscriber.findOne({
      $or: [
        { "facebook.id": profile.id },
        { "local.email": profile.emails[0].value }
      ]
    })
      .then(existingSubscriber => {
        if (existingSubscriber) {
          if (existingSubscriber.facebook.id == undefined) {
            existingSubscriber.facebook.id = profile.id;
            existingSubscriber.facebook.subscribername = profile.displayName;
            existingSubscriber.facebook.email = profile.emails[0].value;
            existingSubscriber.facebook.picture =
              profile._json.picture.data.url;
            existingSubscriber.facebook.token = accessToken;
            existingSubscriber.save();
          }
          done(null, existingSubscriber);
        } else {
          let newSubscriber = new Subscriber({
            method: "facebook",
            facebook: {
              id: profile.id,
              subscribername: profile.displayName,
              email: profile.emails[0].value,
              picture: profile._json.picture.data.url,
              token: accessToken
            }
          });
          newSubscriber.local.email = profile.emails[0].value;
          newSubscriber.local.subscribername = profile.displayName;
          newSubscriber.verified = true;
          newSubscriber.save().then(newSubscriber => {
            done(null, newSubscriber);
          });
        }
      })
      .catch(err => {
        done(err, false, err.message);
      });
  }
=======
passport.use(
  new GoogleStrategy({
    clientID: process.env.googleClientID || process.env.REACT_APP_GOOGLEAUTHCLIENTID,
    clientSecret: process.env.googleClientSecret || process.env.REACT_APP_GOOGLEAUTHSECRET,
    callbackURL: "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      console.log(profile.emails[0].value);
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        return done(null, existingUser);
      }
      const email = profile.emails[0].value;
      const user = await new User({ googleId: profile.id, name: profile.displayName, email: email, username: email }).save();
      done(null, user);
    } catch (error) {
      console.log({ error });
    }
  })
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
);
const githubStrategy = new GitHubStrategy(
  {
    callbackURL: "/auth/github/callback",
    clientID: process.env.REACT_APP_GH_CLIENT_ID,
    clientSecret: process.env.REACT_APP_GH_CLIENT_SECRET,
    scope: "subscriber"
  },
  (accessToken, refreshToken, profile, done) => {
    Subscriber.findOne({
      $or: [
        { "github.id": profile.id },
        { "local.email": profile.emails[0].value }
      ]
    })
      .then(existingSubscriber => {
        if (existingSubscriber) {
          if (existingSubscriber.github.id === undefined) {
            existingSubscriber.github.id = profile.id;
            existingSubscriber.github.subscribername = profile.subscribername;
            existingSubscriber.github.email = profile.emails[0].value;
            existingSubscriber.github.thumbnail = profile._json.avatar_url;
            existingSubscriber.save();
          }
          done(null, existingSubscriber);
        } else {
          let newSubscriber = new Subscriber({
            method: "github",
            github: {
              id: profile.id,
              subscribername: profile.subscribername,
              email: profile.emails[0].value,
              thumbnail: profile._json.avatar_url
            }
          });
          newSubscriber.local.email = profile.emails[0].value;
          newSubscriber.local.subscribername = profile.subscribername;
          newSubscriber.verified = true;
          newSubscriber.save().then(newSubscriber => {
            done(null, newSubscriber);
          });
        }
      })
      .catch(err => {
        done(err, false, err.message);
      });
  }
);

// passport global middleware
passport.use(localStrategy);
passport.use(jwtStrategy);
passport.use(googleStrategy);
passport.use(facebookStrategy);
passport.use(githubStrategy);

// passport local middleware
const passportOptions = { session: false };
const googleOptions = { session: false, scope: ["profile", "email"] };
const facebookOptions = { session: false, scope: ["email"] };
const githubOptions = { session: false, scope: ["subscriber"] };

const authenticate = passport.authenticate("local", passportOptions);
const restricted = passport.authenticate("jwt", passportOptions);
const googleAuthenticate = passport.authenticate("google", googleOptions);
const facebookAuthenticate = passport.authenticate("facebook", facebookOptions);
const githubAuthenticate = passport.authenticate("github", githubOptions);
const googleRedirectAuthenticate = passport.authenticate(
  "google",
  passportOptions
);
const facebookRedirectAuthenticate = passport.authenticate(
  "facebook",
  passportOptions
);
const githubRedirectAuthenticate = passport.authenticate(
  "github",
  passportOptions
);

function makeToken(subscriber) {
  const timestamp = new Date().getTime();
  const payload = {
    iss: "True Business Reviews",
    sub: subscriber._id,
    iat: timestamp
  };
  const options = {
    expiresIn: "7d"
  };
  return jwt.sign(payload, secret, options);
}

// Issue Token
const signToken = (req, res) => {
  const timestamp = new Date().getTime();
  const payload = {
    sub: req.subscriber._id,
    iat: timestamp,
    subscribername: req.subscriber.subscribername
  };
  const options = {
    expiresIn: "7d"
  };
  jwt.sign(payload, secret, options, (err, token) => {
    if (err) {
      res.redirect(`${ROOT_URL.WEB}/login#err=${err}`);
    } else {
      res.redirect(`${ROOT_URL.WEB}/upload#token=${token}`);
    }
  });
};

module.exports = {
  authenticate,
  restricted,
  googleAuthenticate,
  googleRedirectAuthenticate,
  facebookAuthenticate,
  facebookRedirectAuthenticate,
  githubAuthenticate,
  githubRedirectAuthenticate,
  makeToken,
  signToken
};
