const express = require("express");
const Posts = require("../Models/Posts");
const { Error_Messages, Success_Messages } = require("../constants");
const User = require("../Models/UserModel");

const showPosts = async (req, res, next) => {
  try {
    // console.log(req.user);
    const posts = await Posts.find(
      {
        $or: [{ userId: req.user }, { _id: req.query.postId }],
        // $or: [{ userId: req.params.userId }, { _id: req.query.postId }],
      },
      { comments: 1, shares: 1, userId: 1, postDescription: 1, likes: 1 }
    )
      // .select("comments shares userId postDescription ")
      .populate("comments")
      .populate("userId")
      .populate("likes");

    if (!posts.length) {
      res.status(404).send({ message: Error_Messages.Not_Found });
    } else {
      // console.log("post", posts);
      const formattedData = posts.map((object) => {
        return { ...object._doc, likesCount: object.likes.length };
      });

      // console.log(formattedData);
      await res.status(200).send({
        message: "Success",
        post: formattedData,
      });
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const showOthersPosts = async (req, res, next) => {
  try {
    const [user] = await User.find({ _id: req.user });
    // console.log(user.friends);

    // res.send(user.friends);
    const posts = await Posts.find({ userId: { $in: user.friends } });
    // console.log(posts);
    if (!posts.length) {
      res.status(404).send({ message: Error_Messages.Not_Found });
    } else {
      res.status(200).send(posts);
    }
  } catch (error) {
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
      await Posts.updateOne(
        { _id: req.body.postId },
        {
          // $set: { likeCount: post.likes.length },
          $addToSet: { likes: [req.user] },
        },
        { new: true }
      );
      // console.log(req.user);
      await res.status(200).send({ message: "Liked" });
    } else if (req.body.like === "false" && post.likes.includes(req.user)) {
      // const [post] = await Posts.find({ _id: req.body.postId });
      await Posts.updateOne(
        { _id: req.body.postId },
        {
          $pull: { likes: req.user },
          // $set: { likeCount: post.likes.length },
        }
      );
      await res.status(200).send({ message: "Disliked" });
    } else {
      // console.log(post.likes);
      // console.log("here");
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
      $and: [{ userId: req.user }, { _id: req.params.postId }],
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

module.exports = {
  showPosts,
  createPost,
  likePost,
  updatePost,
  deletePost,
  showOthersPosts,
};
