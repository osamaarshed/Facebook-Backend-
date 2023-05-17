const express = require("express");
const Comments = require("../Models/Comments");
const Posts = require("../Models/Posts");
const { Error_Messages, Success_Messages } = require("../constants");

const showComments = async (req, res, next) => {
  try {
    // console.log(req.params.postId);
    const comment = await Comments.find({ postId: req.params.postId })
      .populate("userId")
      .populate("postId");
    res.status(200).send(comment);
  } catch (error) {
    next(error);
  }
};

const createComments = async (req, res, next) => {
  // console.log(req.body.comment, "Comment:");
  // console.log(req.user, "UserId:");
  // console.log(req.body.postId, "PostId");
  const payload = {
    comment: req.body.comment,
    userId: req.user,
    postId: req.body.postId,
  };
  try {
    const comments = await Comments.create(payload);
    await Posts.findOneAndUpdate(
      { _id: req.body.postId },
      { $push: { comments: comments._id } },
      { new: true }
    );

    await res.status(200).send({ message: Success_Messages.Comment });

    // res.send(comments._id);
  } catch (error) {
    // console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

const updateComments = async (req, res, next) => {
  try {
    // const userId = req.body.userId;
    const [comment] = await Comments.find({
      $and: [{ userId: req.user }, { postId: req.body.postId }],
    });
    // console.log(comment[0].userId);
    if (req.user == comment.userId) {
      await Comments.updateOne(
        { userId: req.user },
        { comment: req.body.comment },
        { new: true }
      ).then(() => {
        res.status(200).send({ message: Success_Messages.Update });
      });
    } else {
      res.status(401).send({ message: Error_Messages.UnAuthorized });
    }
  } catch (error) {
    // console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

module.exports = { showComments, createComments, updateComments };
