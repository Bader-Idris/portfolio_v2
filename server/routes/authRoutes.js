const router = require("express").Router();
const passport = require("passport");

const { authenticateUser } = require("../middleware/authentication");
const {
  register,
  login,
  // oauthCallback,
  handleSocialAuthSuccess,
  handleSocialAuthFailure,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);

// // Google OAuth
// router.get('/google', passport.authenticate('google', { session: false }));
// router.get(
//   '/google/callback',
//   passport.authenticate('google', { session: false }),
//   oauthCallback
// );
// // Facebook OAuth
// router.get('/facebook', passport.authenticate('facebook', { session: false }));
// router.get(
//   '/facebook/callback',
//   passport.authenticate('facebook', { session: false }),
//   oauthCallback
// );

router.get(
  "/google",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/api/v1/auth/failure",
  })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  handleSocialAuthSuccess
);
router.get(
  "/facebook",
  passport.authenticate("facebook", {
    session: false,
    failureRedirect: "/api/v1/auth/failure",
  })
);
router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false }),
  handleSocialAuthSuccess
);
router.get("/failure", handleSocialAuthFailure);

router.delete("/logout", authenticateUser, logout);
//! use redis for short periods and mongo for long ones
router.post("/verify-email", verifyEmail);
router.post("/reset-password", resetPassword);
router.post("/forgot-password", forgotPassword);

module.exports = router;
