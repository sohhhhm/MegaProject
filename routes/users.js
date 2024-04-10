const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");
const wrapAsync = require("../utils/wrapAsync");
const { saveRedirectUrl } = require("../middleware.js");

const userController = require("../controllers/users.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(userController.renderLoginForm)
  //Login
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      //learn more from passport page on npm
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login
  );

// Log Out
router.get("/logout", userController.logout);

module.exports = router;
