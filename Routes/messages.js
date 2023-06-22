const express = require("express");
const {
  showMessages,
  showSpecificMessages,
  // saveMessage,
} = require("../Controllers/messages-controller");
const router = express.Router();

//Show
router.get("/", showMessages);
router.get("/:chatRoomId/", showSpecificMessages);

// router.post("/", saveMessage);

module.exports = router;
