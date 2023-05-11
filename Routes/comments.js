const express = require("express");
const router = express.Router();
const commentController = require("../Controllers/comment-controller");

//Show
router.get("/", commentController.showComments);

//Create
router.post("/", commentController.createComments);

//Update
router.put("/", commentController.updateComments);

//Delete

module.exports = router;
