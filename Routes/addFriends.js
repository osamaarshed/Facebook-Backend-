const express = require("express");
const router = express.Router();
const addFriendsController = require("../Controllers/addFriends-controller");

//Send Request
router.post("/addfriends", addFriendsController.sendRequest);

module.exports = router;
