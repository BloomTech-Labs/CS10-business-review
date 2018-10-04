const router = require("express").Router();

const {
  authenticate,
  googleAuthenticate,
  googleRedirectAuthenticate,
  facebookAuthenticate,
  facebookRedirectAuthenticate,
  githubAuthenticate,
  githubRedirectAuthenticate,
  signToken
} = require("../services/passport");
const subscribers = require("../controllers/userController");

<<<<<<< HEAD
router.post("/signup", subscribers.signup);
router.post("/login", authenticate, subscribers.login);
router.get("/google", googleAuthenticate);
router.get("/google/redirect", googleRedirectAuthenticate, signToken);
router.get("/facebook", facebookAuthenticate);
router.get("/facebook/callback", facebookRedirectAuthenticate, signToken);
router.get("/github", githubAuthenticate);
router.get("/github/callback", githubRedirectAuthenticate, signToken);
router.post("/verify", subscribers.verifyEmail);
router.post("/sendverifyemail", subscribers.sendVerifyEmail);

module.exports = router;
=======
  router.get(
    "/auth/google/callback",
    passport.authenticate("google", {
      failureRedirect: frontend + "signin"
    }),
    function(req, res) {
      res.redirect(frontend + "user");
    }
  );
};
>>>>>>> 4e47a008bbdec49647fa59b56a1de2e10a67d796
