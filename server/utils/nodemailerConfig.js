const {
  // SENDGRID_API_KEY,
  MAIL_USER,
  MAIL_PASS,
} = require("../config/config");
module.exports = {
  host: "mail.baderidris.com", // Use the docker service name since they're on same network
  //host: "smtp.sendgrid.net",// sendgrid -> settings -> sender auth
  port: 587, // Use STARTTLS
  secure: false, // Set to false for STARTTLS
  auth: {
    user: MAIL_USER, // "apikey",
    pass: MAIL_PASS, // SENDGRID_API_KEY,
  },
  tls: {
    rejectUnauthorized: false, // Set to false if you are using self-signed certificates (not recommended for production)
  },
};

// check the rate limiting of sending mails sendGrid:
// https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api#rate-limits