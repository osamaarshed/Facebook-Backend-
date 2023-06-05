const express = require("express");
const router = express.Router();
const {
  showPosts,
  createPost,
  likePost,
  updatePost,
  deletePost,
  showOthersPosts,
  // putLikePost,
} = require("../Controllers/posts-controller");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // cb(null, "../../facebook_frontend/public");
    cb(null, "public/images");
  },
  filename: function (req, file, cb) {
    cb(null, Math.random().toString().slice(2, 6) + "_" + file.originalname);
  },
});
const upload = multer({ storage: storage });
//Show
router.get("/", showPosts);

router.get("/all", showOthersPosts);

// Create
router.post("/", upload.single("inputFile"), createPost);
// router.post("/", createPost);

// Post Like
router.put("/like", likePost);

//Put Like Post
// router.put("/like/:postId/:status", putLikePost);

//Update
router.put("/", updatePost);

//Delete
router.delete("/:postId", deletePost);

module.exports = router;
