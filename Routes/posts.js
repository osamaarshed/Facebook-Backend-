const express = require("express");
const router = express.Router();
const Posts = require("../Models/Posts");
const Likes = require("../Models/Likes");

//Show
router.get("/:userId", async (req, res) => {
  try {
    const post = await Posts.find({
      userId: req.params.userId,
      _id: req.query.postId,
    })
      .populate("comments")
      .populate("userId");
    // console.log(req.params);
    // console.log(req.query);
    // console.log(post);
    res.status(200).send(post);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
});

// //Show By IDs
// router.get("/", async (req, res) => {
//   try {
//     const posts = await Posts.find({ postId: req.query.userId });
//     res.send(posts);
//     // const posts = await Posts.find({ userId: req.params.userId });
//     // res.send(posts);
//   } catch (error) {
//     console.log(error);
//     res.status(404).send({ message: "Not Found" });
//   }
// });

// Create
router.post("/", async (req, res) => {
  try {
    await Posts.create({
      likes: [],
      comments: [],
      shares: req.body.shares,
      userId: req.body.userId,
    }).then(() => {
      res.status(201).send({ message: "Created" });
    });
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
});

// Post Like
router.post("/like", async (req, res) => {
  try {
    if (req.body.like === "true") {
      await Posts.findOneAndUpdate(
        { _id: req.body.postId },
        { $addToSet: { likes: [req.body.userId] } }
      )
        // .then(async () => {
        //   await Posts.findOneAndUpdate(
        //     { _id: req.body.postId },
        //     { likeCount: likes.length }
        //   );
        // })
        .then(() => {
          res.status(200).send({ message: "Liked" });
        });
    } else {
      res.send({ message: "Like Did not Added because it was false" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
});

// Update
// router.put("/:userid", async (req, res) => {
//   try {
//     await Posts.findOneAndUpdate(
//       { _id: req.params.userid },
//       { $push: { comments: req.body.userid } },
//       { new: true }
//     ).then(() => {
//       res.status(200).send("Updated");
//     });
//   } catch (error) {
//     res.status(404).send({ message: error });
//   }
// });

//Delete
router.delete("/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const post = await Posts.findOneAndDelete({ userId: userId });
    if (!post) {
      res.status(404).send({ message: "No Post Found" });
    } else {
      res.status(200).send({ message: "Successfully Deleted", post: post });
    }
  } catch (error) {
    res.status(404).send({ message: error });
  }
});

module.exports = router;
