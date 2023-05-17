const express = require("express");
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  findFriend,
  showRequests,
  showFriends
} = require("../Controllers/addFriends-controller");

//Show Friends
router.get("/", showFriends);
//Show Requests
router.get("/requests", showRequests);
//Find Friends
router.get("/:email", findFriend);

//Send Request
router.post("/", sendRequest);

//Accept Request
router.post("/status", acceptRequest);

//Show Requests
// router.get("/", showRequests);

module.exports = router;
