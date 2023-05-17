const express = require("express");
const router = express.Router();
const {
  showComments,
  createComments,
  updateComments,
} = require("../Controllers/comment-controller");

//Show
router.get("/:postId", showComments);

//Create
router.post("/", createComments);

//Update
router.put("/", updateComments);

//Delete

module.exports = router;
