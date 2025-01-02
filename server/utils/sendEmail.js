const nodemailer = require('nodemailer');

const nodemailerConfig = require('./nodemailerConfig');
//! add the prod configs in 👆 file, and change below sender's conf though

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: "Bader Idris <contact@baderidris.com>",
    //it's same as => from: {name:"", email: ""}
    replyTo: "Bader Idris <contact@baderidris.com>",
    to,
    subject,
    html,
    // text,
    // hostinger's one has:
    // from.email as: no-reply@account.hostinger.com
    // replyTo as: support@hostinger.com
  });
};

module.exports = sendEmail;
