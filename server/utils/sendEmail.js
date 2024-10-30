const nodemailer = require('nodemailer');

const nodemailerConfig = require('./nodemailerConfig');
//! add the prod configs in 👆 file, and change below sender's conf though

const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport(nodemailerConfig);

  return transporter.sendMail({
    from: '"Bader Idrees" <www.bader.com9@gmail.com>',
    //it's same as => from: {name:"", email: ""}
    replyTo: "www.bader.com9@gmail.com",
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
