const express = require("express");
const Comments = require("../Models/Comments");
const Posts = require("../Models/Posts");

const showComments = async (req, res) => {
  try {
    const comment = await Comments.find({})
      .populate("userId")
      .populate("postId");
    res.status(200).send(comment);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

const createComments = async (req, res) => {
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
    // console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

const updateComments = async (req, res) => {
  try {
    // const userId = req.body.userId;
    const comment = await Comments.find({
      $and: [{ userId: req.body.userId }, { postId: req.body.postId }],
    });
    // console.log(comment[0].userId);
    if (req.body.userId == comment[0].userId) {
      await Comments.updateOne(
        { userId: req.body.userId },
        { comment: req.body.comment },
        { new: true }
      ).then(() => {
        res.status(200).send({ message: "Successfully Updated" });
      });
    } else {
      res.status(401).send({ message: "You are not authorized" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = { showComments, createComments, updateComments };
