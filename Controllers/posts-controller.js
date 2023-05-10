const express = require("express");
const Posts = require("../Models/Posts");

const showPosts = async (req, res) => {
  try {
    const post = await Posts.find({
      $or: [{ userId: req.params.userId }, { _id: req.query.postId }],
    })
      .populate("comments")
      .populate("userId");

    res.status(200).send(post);
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
    if (req.body.like === "true") {
      await Posts.findOneAndUpdate(
        { _id: req.body.postId },
        { $addToSet: { likes: [req.body.userId] } }
      ).then(() => {
        res.status(200).send({ message: "Liked" });
      });
    } else {
      res.send({ message: "Like Did not Added because it was false" });
    }
  } catch (error) {
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
