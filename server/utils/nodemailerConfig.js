const {
  SENDGRID_API_KEY,
} = require("../config/config");
module.exports = {
  host: "smtp.sendgrid.net",// sendgrid -> settings -> sender auth
  // for making the sender as yourWebsite.com instead of sendGrid.net
  port: 587,//if ssl port: 465
  auth: {
    user: "apikey",
    pass: SENDGRID_API_KEY,
  },
};

// check the rate limiting of sending mails sendGrid:
// https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api#rate-limits