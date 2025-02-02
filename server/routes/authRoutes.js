const router = require("express").Router();
const passport = require("passport");
const {
  generateOAuthState,
  verifyOAuthState,
} = require("../middleware/oauthState");
const { authenticateUser } = require("../middleware/authentication");
const {
  register,
  login,
  handleSocialAuthSuccess,
  handleSocialAuthFailure,
  logout,
  verifyEmail,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.get(
  "/google",
  generateOAuthState,
  passport.authenticate("google", {
    session: false,
    scope: ["profile", "email"],
    state: (req) => req.state, // Pass generated state
  })
);
router.get(
  "/google/callback",
  verifyOAuthState,
  passport.authenticate("google", { session: false }),
  handleSocialAuthSuccess
);
router.get(
  "/facebook",
  generateOAuthState,
  passport.authenticate("facebook", {
    session: false,
    scope: ["email"],
    state: (req) => req.state,
  })
);
router.get(
  "/facebook/callback",
  verifyOAuthState,
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
