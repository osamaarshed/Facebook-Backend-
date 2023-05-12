const express = require("express");
const Posts = require("../Models/Posts");
const { Error_Messages, Success_Messages } = require("../constants");

const showPosts = async (req, res, next) => {
  try {
    // console.log(req.user);
    const [post] = await Posts.find(
      {
        $or: [{ userId: req.user }, { _id: req.query.postId }],
        // $or: [{ userId: req.params.userId }, { _id: req.query.postId }],
      },
      { comments: 1, shares: 1, userId: 1, postDescription: 1 }
    )
      .populate("comments")
      .populate("userId");

    // console.log(post.likes.length);
    res.status(200).send({ message: "Success", post: post });
  } catch (error) {
    console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

const createPost = async (req, res, next) => {
  try {
    await Posts.create({
      likes: [],
      comments: [],
      userId: req.user,
      postDescription: req.body.postDescription,
    }).then(() => {
      res.status(201).send({ message: Success_Messages.Created });
    });
  } catch (error) {
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

const likePost = async (req, res, next) => {
  try {
    const [post] = await Posts.find({ _id: req.body.postId });
    if (req.body.like === "true") {
      await Posts.updateMany(
        { _id: req.body.postId },
        {
          $set: { likeCount: post.likes.length },
          $addToSet: { likes: [req.user] },
        }
      ).then(() => {
        res.status(200).send({ message: "Liked" });
      });
    } else if (req.body.like === "false" && post.likes.includes(req.user)) {
      // const [post] = await Posts.find({ _id: req.body.postId });
      await Posts.updateMany(
        { _id: req.body.postId },
        {
          $pull: { likes: req.user },
          $set: { likeCount: post.likes.length },
        }
      ).then(() => {
        res.status(200).send({ message: "Disliked" });
      });
    } else {
      // console.log(post.likes);
      res.status(404).send({ message: Error_Messages.Not_Found });
    }
  } catch (error) {
    // console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  try {
    const post = await Posts.findOneAndUpdate(
      {
        $and: [{ userId: req.user }, { _id: req.body.postId }],
      },
      { postDescription: req.body.postDescription }
    );
    // console.log(post);

    if (post) {
      res.status(200).send({ message: Success_Messages.Update });
    } else {
      res.status(401).send({
        message: Error_Messages.Not_Found,
      });
    }
  } catch (error) {
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const post = await Posts.find({
      $and: [{ userId: req.user }, { _id: req.query.postId }],
    }).deleteOne();

    if (post.deletedCount) {
      res.status(200).send({ message: Success_Messages.Delete, user: post });
    } else {
      res.status(401).send({
        message: Error_Messages.UnAuthorized,
        user: post.deletedCount,
      });
    }
  } catch (error) {
    // console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

module.exports = { showPosts, createPost, likePost, updatePost, deletePost };
