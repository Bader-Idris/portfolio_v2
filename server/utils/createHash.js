const crypto = require('crypto');
// check the zach project's file:
//! lib/passwordUtils.js
// it's important to improve this with best practices
// and fix the jwt file in this though
//! for hashing and salting, we need to fix the /models/mongo/User schema file,
//! and get the properties from above mentioned file
const hashString = (string) =>
  crypto.createHash('md5').update(string).digest('hex');

module.exports = hashString;
