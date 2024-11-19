const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizePermissions,
} = require("../middleware/authentication");

const {
  postReceivedEmail,
  getAllReceivedEmails
} = require("../controllers/receivedEmailsController");

router
  .route("/")
  .post(postReceivedEmail)
  .get([authenticateUser, authorizePermissions("admin")], getAllReceivedEmails);

// router.route("/:id/emails").get(getSingleEmail);

module.exports = router;
