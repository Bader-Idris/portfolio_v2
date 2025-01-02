const nodemailer = require("nodemailer");
const { StatusCodes } = require("http-status-codes");
const validator = require("validator");
const Email = require("../models/mongo/ReceivedEmail");

// Configure the transporter with environment variables
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const postReceivedEmail = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Missing required fields" });
  }

  if (!validator.isEmail(email)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Invalid email format" });
  }

  if (message.length > 5000) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "Message is too long" });
  }
  // TODO get normal one, because nginx handles it
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // const newEmail = await Email.create({ name, email, message });
  try {
    const newEmail = await Email.create({ name, email, message, ip });

    // Send an email using SMTP
    const mailOptions = {
      from: email,
      to: "Bader Idris <contact@baderidris.com>",
      subject: "New Email from a client",
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
    };

    await newEmail.save();
    await transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      }
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Error saving email or sending email:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while processing the request" });
  }
};
const getAllReceivedEmails = async (req, res) => {
  try {
    // Retrieve all emails from the database
    const emails = await Email.find({}).sort({ createdAt: -1 });

    if (emails.length === 0) {
      return res
        .status(StatusCodes.NO_CONTENT)
        .json({ message: "No emails found" });
    }

    res.status(StatusCodes.OK).json({ emails });
  } catch (err) {
    console.error("Error retrieving emails:", err);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: "An error occurred while fetching emails" });
  }
};

module.exports = {
  postReceivedEmail,
  getAllReceivedEmails,
};
