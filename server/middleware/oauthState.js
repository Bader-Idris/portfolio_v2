const { createStateToken, verifyStateToken } = require("../utils");
const { ORIGIN_URL } = require("../config/config");

const generateOAuthState = (req, res, next) => {
  const state = crypto.randomBytes(16).toString("hex");
  const stateToken = createStateToken(state);

  res.cookie("oauth_state", stateToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    signed: true,
    maxAge: 300000, // 5 minutes
  });

  req.state = state;
  next();
};

const verifyOAuthState = (req, res, next) => {
  const stateToken = req.signedCookies.oauth_state;
  const state = req.query.state;

  if (!stateToken || !state) {
    return res.redirect(`${ORIGIN_URL}/login?error=invalid_state`);
  }

  const decoded = verifyStateToken(stateToken);
  if (!decoded || decoded.state !== state) {
    return res.redirect(`${ORIGIN_URL}/login?error=invalid_state`);
  }

  res.clearCookie("oauth_state");
  next();
};

module.exports = { generateOAuthState, verifyOAuthState };
