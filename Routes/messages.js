const express = require("express");
const {
  showMessages,
  // saveMessage,
} = require("../Controllers/messages-controller");
const router = express.Router();

//Show
router.get("/", showMessages);

// router.post("/", saveMessage);

module.exports = router;
