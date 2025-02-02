const jwt = require('jsonwebtoken');
const {
  JWT_SECRET,
} = require("../config/config");

const createJWT = ({ payload }) => {
  const token = jwt.sign(
    payload,
    JWT_SECRET
    // we can add the hash algorithm in here, as RS256,
    // check user auth youtube video with Zach on FreeCodeCamp
    // at 4:15:~~ and also in the verify method though
    // check the file: https://github.com/zachgoll/express-session-authentication-starter/blob/final/conceptual-tutorials/JWT/jsonwebtoken.js
    //TODO 4:17:## is very useful!
    //! generateKeyPair.js is important
  );
  return token;
};

const isTokenValid = (token) => jwt.verify(token, JWT_SECRET);

const createStateToken = (state) => {
  return jwt.sign({ state }, JWT_SECRET, { expiresIn: '5m' });
};
const verifyStateToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const attachCookiesToResponse = ({ res, user, refreshToken }) => {
  const accessTokenJWT = createJWT({ payload: { user } });
  const refreshTokenJWT = createJWT({ payload: { user, refreshToken } });

  const oneDay = 1000 * 60 * 60 * 24;
  const longerExp = 1000 * 60 * 60 * 24 * 30;

  res.cookie('accessToken', accessTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + oneDay),
  });

  res.cookie('refreshToken', refreshTokenJWT, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
    expires: new Date(Date.now() + longerExp),
  });
};

module.exports = {
  createJWT,
  isTokenValid,
  attachCookiesToResponse,
  createStateToken,
  verifyStateToken,
};
