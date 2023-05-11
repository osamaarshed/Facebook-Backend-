const express = require("express");
const router = express.Router();
const addFriendsController = require("../Controllers/addFriends-controller");

//Send Request
router.post("/", addFriendsController.sendRequest);

//Accept Request
router.post("/status", addFriendsController.acceptRequest);

module.exports = router;
