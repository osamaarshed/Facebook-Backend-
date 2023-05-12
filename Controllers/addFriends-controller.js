const express = require("express");
const User = require("../Models/UserModel");
const {
  Error_Messages,
  Random_Messages,
  Success_Messages,
} = require("../constants");

const sendRequest = async (req, res, next) => {
  try {
    const userId = req.user;
    const friendId = req.body.friendId;

    const [user] = await User.find({ _id: userId });
    // .populate("friends")
    // .populate("friendRequests");
    if (!user) {
      res.status(404).send({ message: Error_Messages.Not_Exist });
    }
    const [friend] = await User.find({ _id: friendId });
    if (!friend) {
      res.status(404).send({ message: Error_Messages.Not_Exist });
    }
    // console.log(friend.friendRequests.includes(friendId));
    if (
      friend.friends.includes(userId) ||
      friend.friendRequests.includes(userId)
    ) {
      res.send({ message: Random_Messages.Already_Sent });
    } else {
      friend.friendRequests.push(userId);
      await friend.save();
      res.status(200).send({ message: Success_Messages.Sent });
    }
  } catch (error) {
    // console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    // const userId = req.body.userId;

    const user = await User.findById(req.user);

    if (!user.friendRequests.length) {
      // console.log("No fr");
      res.status(404).send({ message: "No Friend Requests" });
    }
    if (
      user.friendRequests.includes(req.body.friendId) &&
      req.body.status === "accept"
    ) {
      await User.updateMany(
        { _id: req.user },
        {
          $addToSet: { friends: [req.body.friendId] },
          $pull: { friendRequests: req.body.friendId },
        }
      );
      // .then(async () => {
      await User.updateOne(
        { _id: req.body.friendId },
        { $addToSet: { friends: [req.user] } }
      );
      // })
      // .then(() => {
      res.status(200).send({ message: Success_Messages.Add });
      // });
      //   await reqAccept.save();
    } else if (
      user.friendRequests.includes(req.body.friendId) &&
      req.body.status === "delete"
    ) {
      await user.updateOne({ $pull: { friendRequests: req.body.friendId } });
      user.save();
      res.status(200).send({ message: Success_Messages.Delete });
    } else {
      res.status(404).send({ message: "Friend Request does not exist" });
    }
  } catch (error) {
    // console.log(error);
    // res.status(404).send({ message: Error_Messages.Not_Found });
    next(error);
  }
};

module.exports = { sendRequest, acceptRequest };
