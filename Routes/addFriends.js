const express = require("express");
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
} = require("../Controllers/addFriends-controller");

//Send Request
router.post("/", sendRequest);

//Accept Request
router.post("/status", acceptRequest);

//Show Requests
// router.get("/", showRequests);

module.exports = router;
