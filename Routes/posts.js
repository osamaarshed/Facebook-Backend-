const express = require("express");
const router = express.Router();
const postController = require("../Controllers/posts-controller");

//Show
router.get("/posts/:userId", postController.showPosts);

// Create
router.post("/posts", postController.createPost);

// Post Like
router.post("/posts/like", postController.likePost);

//Update
router.put("/posts", postController.updatePost);

//Delete
router.delete("/posts", postController.deletePost);

module.exports = router;
