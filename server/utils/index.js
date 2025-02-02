const {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createStateToken,
  verifyStateToken,
} = require("./jwt");
const createTokenUser = require('./createTokenUser');
const checkPermissions = require('./checkPermissions');
const sendVerificationEmail = require("./sendVerificationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const createHash = require("./createHash");
const initializeSocialStrategies = require("./passport");

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createStateToken,
  verifyStateToken,
  createTokenUser,
  checkPermissions,
  sendVerificationEmail,
  sendResetPasswordEmail,
  createHash,
  initializeSocialStrategies,
};
