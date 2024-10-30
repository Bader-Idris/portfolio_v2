const sendEmail = require('./sendEmail');

const sendVerificationEmail = async ({
  name,
  email,
  verificationToken,
  origin,
}) => {
  //! check https://mc.sendgrid.com/design-library  for modifying emails easily
  const verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;

  const message = `<p>Please confirm your email by clicking on the following link: 
  <a href="${verifyEmail}">Verify Email</a> </p>`;

  return sendEmail({
    //! /email-statics/verification.html use handlebars, because statics are headaches
    to: email,
    subject: "Email Confirmation",
    html: `<h4> Hello, ${name}</h4>
    ${message}
    `,
  });
};

module.exports = sendVerificationEmail;
