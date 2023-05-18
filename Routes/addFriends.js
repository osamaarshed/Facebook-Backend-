const express = require("express");
const router = express.Router();
const {
  sendRequest,
  acceptRequest,
  findFriend,
  showRequests,
  showFriends,
  deleteFriends,
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

//Delete Request
router.delete("/:friendId", deleteFriends);

//Show Requests
// router.get("/", showRequests);

module.exports = router;
