const passport = require("passport");
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: FacebookStrategy } = require('passport-facebook');
const User = require("../models/mongo/User");
const CustomError = require("../errors");
const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  FACEBOOK_APP_ID,
  FACEBOOK_APP_SECRET
} = require("../config/config");

const initializeSocialStrategies = () => {
  // Google Strategy
  passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/v1/auth/google/callback",
        scope: ["profile", "email"],
        state: false,
      },
      socialCallback
    )
  );

  // Facebook Strategy
  passport.use(
    "facebook",
    new FacebookStrategy(
      {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "/api/v1/auth/facebook/callback",
        profileFields: ["id", "emails", "name", "displayName"],
        state: false,
      },
      socialCallback
    )
  );
};

const socialCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value;
    const provider = profile.provider;

    if (!email)
      throw new CustomError.BadRequestError(
        "Email not found in social profile"
      );

    const user = await User.findOrCreate({
      email,
      provider,
      providerId: profile.id,
      name: profile.displayName,
    });

    done(null, user);
  } catch (error) {
    done(error, null);
  }
};

module.exports = initializeSocialStrategies;
