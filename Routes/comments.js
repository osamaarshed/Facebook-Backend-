const express = require("express");
const router = express.Router();
const commentController = require("../Controllers/comment-controller");

//Show
router.get("/comments", commentController.showComments);

//Create
router.post("/comments", commentController.createComments);

//Update
router.put("/comments", commentController.updateComments);

//Delete

module.exports = router;
