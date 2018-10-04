const passport = require("passport");
let frontend = process.env.REACT_APP_LOCAL_FRONTEND
  ? process.env.REACT_APP_LOCAL_FRONTEND
  : "https://true-business.netlify.com/";

module.exports = router => {
  // router.get(
  //   "/auth/google",
  //   passport.authenticate("google", {
  //     scope: ["profile", "email"],
  //   }),
  // );

  // router.get(
  //   "/auth/google/callback",
  //   passport.authenticate("google", {
  //     failureRedirect: frontend + "signin",
  //   }),
  //   function(req, res) {
  //     res.redirect(frontend + "user");
  //   },
  // );

  router.get(
    "/auth/google",
    passport.authenticate("google", {
      scope:
        "https://www.googleapis.com/auth/plus.me https://www.google.com/m8/feeds https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
    }),
  );

  router.get("/auth/google/redirect", function() {
    passport.authenticate("google", {
      successRedirect: "/profile",
      failureRedirect: "/fail",
    });
  });
  router.get("/logout", function(req, res) {
    req.logOut();
    res.redirect("/");
  });
};
