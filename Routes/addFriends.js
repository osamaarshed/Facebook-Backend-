const express = require("express");
const router = express.Router();
const addFriendsController = require("../Controllers/addFriends-controller");

//Send Request
router.post("/", addFriendsController.sendRequest);

//Accept Request
router.post("/status", addFriendsController.acceptRequest);

//Show Requests
router.get("/", addFriendsController.showRequests);

module.exports = router;
