const express = require("express");
const User = require("../Models/UserModel");
const {
  Error_Messages,
  Random_Messages,
  Success_Messages,
} = require("../constants");

const findFriend = async (req, res, next) => {
  // console.log(req.params.email);
  const friend = await User.find({ email: req.params.email });
  // console.log(friend);
  if (!friend) {
    // console.log("here");
    res.status(404).send({ message: Error_Messages.Not_Found });
  } else {
    res.status(200).send(friend);
  }
};

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

const showRequests = async (req, res, next) => {
  try {
    // console.log(req.user, "heer");
    const [user] = await User.find({ _id: req.user }).populate(
      "friendRequests"
    );
    // console.log(user);
    res.status(200).send({ requests: user.friendRequests });
  } catch (error) {
    next(error);
  }
};
const showFriends = async (req, res, next) => {
  try {
    const [user] = await User.find({ _id: req.user }).populate("friends");
    if (!user.friends.length) {
      res.status(404).send({ message: Error_Messages.No_friends });
    } else {
      res.status(200).send({ message: user.friends });
    }
  } catch (error) {
    next(error);
  }
};

const acceptRequest = async (req, res, next) => {
  try {
    // const userId = req.body.userId;
    // console.log("here");
    const user = await User.findById(req.user);

    if (!user.friendRequests.length) {
      res.status(404).send({ message: "No Friend Requests" });
    }
    if (
      user.friendRequests.includes(req.body.friendId) &&
      req.body.status === "accept"
    ) {
      await User.updateMany(
        { _id: req.user },
        {
          $pull: { friendRequests: req.body.friendId },
          $addToSet: { friends: [req.body.friendId] },
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
      req.body.status === "reject"
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

const deleteFriends = async (req, res, next) => {
  try {
    const [user] = await User.find({
      _id: req.user,
    });
    const [friend] = await User.find({ _id: req.params.friendId });
    if (user.friends.includes(req.params.friendId)) {
      await user.updateOne({ $pull: { friends: req.params.friendId } });
      await friend.updateOne({ $pull: { friends: req.user } });
      res.status(200).send({ message: Success_Messages.Delete });
    } else {
      res.status(404).send({ message: Error_Messages.Not_Exist });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendRequest,
  acceptRequest,
  findFriend,
  showRequests,
  showFriends,
  deleteFriends,
};
