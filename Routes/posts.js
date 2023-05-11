const express = require("express");
const router = express.Router();
const postController = require("../Controllers/posts-controller");

//Show
router.get("/:userId", postController.showPosts);

// Create
router.post("/", postController.createPost);

// Post Like
router.post("/like", postController.likePost);

//Update
router.put("/", postController.updatePost);

//Delete
router.delete("/", postController.deletePost);

module.exports = router;
