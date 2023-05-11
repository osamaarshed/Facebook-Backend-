const express = require("express");
const Posts = require("../Models/Posts");

const showPosts = async (req, res) => {
  try {
    const [post] = await Posts.find(
      {
        $or: [{ userId: req.params.userId }, { _id: req.query.postId }],
      },
      { comments: 1, shares: 1, userId: 1, postDescription: 1 }
    )
      .populate("comments")
      .populate("userId");

    // console.log(post.likes.length);
    res.status(200).send({ message: "Success", post: post });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

const createPost = async (req, res) => {
  try {
    await Posts.create({
      likes: [],
      comments: [],
      shares: req.body.shares,
      userId: req.body.userId,
      postDescription: req.body.postDescription,
    }).then(() => {
      res.status(201).send({ message: "Created" });
    });
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

const likePost = async (req, res) => {
  try {
    const [post] = await Posts.find({ _id: req.body.postId });
    if (req.body.like === "true") {
      // await Posts.findOneAndUpdate(
      //   { _id: req.body.postId },
      //   { $addToSet: { likes: [req.body.userId] } }

      // ).then(() => {
      //   res.status(200).send({ message: "Liked" });
      // });
      // const [post] = await Posts.find({ _id: req.body.postId });

      await Posts.updateMany(
        { _id: req.body.postId },
        {
          $set: { likeCount: post.likes.length },
          $addToSet: { likes: [req.body.userId] },
        }
      ).then(() => {
        res.status(200).send({ message: "Liked" });
      });
    } else if (
      req.body.like === "false" &&
      post.likes.includes(req.body.userId)
    ) {
      // const [post] = await Posts.find({ _id: req.body.postId });
      await Posts.updateMany(
        { _id: req.body.postId },
        {
          $pull: { likes: req.body.userId },
          $set: { likeCount: post.likes.length },
        }
      ).then(() => {
        res.status(200).send({ message: "Disliked" });
      });
    } else {
      // console.log(post.likes);
      res.status(404).send("sandkjas");
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await Posts.findOneAndUpdate(
      {
        $and: [{ userId: req.body.userId }, { _id: req.body.postId }],
      },
      { postDescription: req.body.postDescription }
    );
    // console.log(post);

    if (post) {
      res.status(200).send({ message: "Updated Successfully" });
    } else {
      res.status(401).send({
        message: "Not Authorized to Update this post",
      });
    }
  } catch (error) {
    res.status(404).send({ message: error });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await Posts.find({
      $and: [{ userId: req.query.userId }, { _id: req.query.postId }],
    }).deleteOne();

    if (post.deletedCount) {
      res.status(200).send({ message: "Deleted Successfully", user: post });
    } else {
      res.status(401).send({
        message: "Not Authorized to Delete this post",
        user: post.deletedCount,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = { showPosts, createPost, likePost, updatePost, deletePost };
