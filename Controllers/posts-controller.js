const express = require("express");
const Posts = require("../Models/Posts");
const { Error_Messages, Success_Messages } = require("../constants");
const User = require("../Models/UserModel");
const { default: mongoose } = require("mongoose");

const showPosts = async (req, res, next) => {
  try {
    const posts = await Posts.find(
      {
        $or: [{ userId: req.user }, { _id: req.query.postId }],
      }
      // {
      //   comments: 1,
      //   shares: 1,
      //   userId: 1,
      //   postDescription: 1,
      //   likes: 1,
      //   inputFile: 1,
      // }
    )
      .populate("comments")
      .populate("userId")
      .populate("likes");

    if (!posts.length) {
      res.status(404).send({ message: Error_Messages.Not_Found });
    } else {
      const formattedData = posts.map((object) => {
        return {
          ...object._doc,
          likesCount: object.likes.length,
        };
      });

      await res.status(200).send({
        message: "Success",
        post: formattedData,
      });
    }
  } catch (error) {
    next(error);
  }
};

const showOthersPosts = async (req, res, next) => {
  try {
    const [user] = await User.find({ _id: req.user });
    const posts = await Posts.find({ userId: { $in: user.friends } })
      .populate("userId")
      .populate("comments")
      .populate("likes");
    if (!posts.length) {
      res.status(404).send({ message: Error_Messages.Not_Found });
    } else {
      const formattedData = posts.map((object) => {
        return { ...object._doc, likesCount: object.likes.length };
      });
      await res.status(200).send(formattedData);
    }
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  // console.log(req.file, "ertyui");
  try {
    await Posts.create({
      likes: [],
      comments: [],
      userId: req.user,
      postDescription: req.body.postDescription,
      inputFile: req.file ? req.file.filename : null,
    }).then(() => {
      res.status(201).send({ message: Success_Messages.Created });
    });
  } catch (error) {
    // res.status(404).send({ message: Error_Messages.Not_Found });
    console.log(error);
    next(error);
  }
};

// const putLikePost = async (req, res, next) => {
//   try {
//     if (req.params.status === "true") {
//       const post = await Posts.findOneAndUpdate(
//         { _id: req.params.postId },
//         { $addToSet: { likes: [req.user] } }
//       );
//       console.log(post);
//       // res.status(200).send({ message: post });
//     } else {
//       // console.log(req.params.postId);\

//       const post = await Posts.aggregate([
//         {
//           $match: { _id: new mongoose.Types.ObjectId(req.params.postId) },
//         },
//         {
//           $project: {
//             likes: {
//               $cond: {
//                 if: { $elemMatch: req.user },
//                 then: { $pull: { likes: req.user } },
//               },
//             },
//           },
//         },
//       ]);

//       console.log(post);
//       res.send(post);
//     }
//   } catch (error) {
//     next(error);
//   }
// };

const likePost = async (req, res, next) => {
  try {
    if (req.body.like === "true") {
      const post = await Posts.findOneAndUpdate(
        { _id: req.body.postId },
        {
          $addToSet: { likes: req.user },
        },
        { new: true }
      );
      const formattedData = { ...post._doc, likesCount: post.likes.length };

      await res.status(200).send({ message: "Liked", post: formattedData });
    } else if (req.body.like === "false") {
      const data = await Posts.findOne({
        _id: req.body.postId,
      });
      if (data.likes.includes(req.user)) {
        const post = await Posts.findOneAndUpdate(
          { _id: req.body.postId },
          {
            $pull: { likes: req.user },
          },
          { new: true }
        );
        const formattedData = { ...post._doc, likesCount: post.likes.length };
        await res
          .status(200)
          .send({ message: "Disliked", post: formattedData });
      } else {
        const formattedData = { ...data._doc, likesCount: data.likes.length };
        await res
          .status(200)
          .send({ message: "Disliked", post: formattedData });
        res
          .status(400)
          .send({ message: "invalid User Req", post: formattedData });
      }
    } else {
      res.status(400).send({ message: "Either True or False" });
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
  // putLikePost,
};
