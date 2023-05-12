const express = require("express");
const router = express.Router();
const {
  showPosts,
  createPost,
  likePost,
  updatePost,
  deletePost,
} = require("../Controllers/posts-controller");

//Show
router.get("/", showPosts);

// Create
router.post("/", createPost);

// Post Like
router.post("/like", likePost);

//Update
router.put("/", updatePost);

//Delete
router.delete("/", deletePost);

module.exports = router;
