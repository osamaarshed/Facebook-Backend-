const express = require("express");
const router = express.Router();
const Comments = require("../Models/Comments");
const Posts = require("../Models/Posts");

//Show
router.get("/", async (req, res) => {
  try {
    const comment = await Comments.find({})
      .populate("userId")
      .populate("postId");
    res.status(200).send(comment);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
});

//Create
router.post("/", async (req, res) => {
  const payload = {
    comment: req.body.comment,
    userId: req.body.userId,
    postId: req.body.postId,
  };
  try {
    // await Comments.create(payload).then(() => {
    //   res.status(201).send({ message: "Comment Posted" });
    // });
    const comments = await Comments.create(payload);
    await Posts.findOneAndUpdate(
      { _id: req.body.postId },
      { $push: { comments: comments._id } },
      { new: true }
    ).then(() => {
      res.send("Done");
    });
    // res.send(comments._id);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
});

//Delete
// router.delete("/:userId", async (req, res) => {
//   const user = req.params.userId;
//   const postId = await Comments.find({ userId: user });
//   console.log("PostId: ", postId, "user: ", user);
// });

module.exports = router;
