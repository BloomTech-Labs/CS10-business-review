const passport = require("passport");
let frontend = process.env.REACT_APP_LOCAL_FRONTEND
  ? process.env.REACT_APP_LOCAL_FRONTEND
  : "https://true-business.netlify.com/";

module.exports = router => {
  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"]
    })
  );

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
