const express = require("express");
const Authentication = require("../Models/Authentication");

const showRequests = async (req, res) => {
  // try {
  //   const [requests] = await Authentication.find({
  //     _id: req.query.userId,
  //   });
  //   // .populate("friends");
  //   console.log(requests);
  //   res.status(200).send({ message: requests });
  // } catch (error) {
  //   res.status(404).send({ message: "Not Found" });
  // }
};

const sendRequest = async (req, res) => {
  try {
    const userId = req.body.userId;
    const friendId = req.body.friendId;

    const [user] = await Authentication.find({ _id: userId });
    // .populate("friends")
    // .populate("friendRequests");
    if (!user) {
      res.status(404).send({ message: "User does not exist" });
    }
    const [friend] = await Authentication.find({ _id: friendId });
    if (!friend) {
      res.status(404).send({ message: "This user does not exist" });
    }
    // console.log(friend.friendRequests.includes(friendId));
    if (
      friend.friends.includes(userId) ||
      friend.friendRequests.includes(userId)
    ) {
      res.send({ message: "Friend Request Already Sent" });
    } else {
      friend.friendRequests.push(userId);
      await friend.save();
      res.status(200).send({ message: "Friend Request Added" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

const acceptRequest = async (req, res) => {
  try {
    // const userId = req.body.userId;

    const user = await Authentication.findById(req.body.userId);

    if (!user.friendRequests.length) {
      // console.log("No fr");
      res.status(404).send({ message: "No Friend Requests" });
    }
    if (
      user.friendRequests.includes(req.body.friendId) &&
      req.body.status === "accept"
    ) {
      //   console.log(user);
      await Authentication.updateMany(
        { _id: req.body.userId },
        {
          $addToSet: { friends: [req.body.friendId] },
          $pull: { friendRequests: req.body.friendId },
        }
      );
      // .then(async () => {
      await Authentication.updateOne(
        { _id: req.body.friendId },
        { $addToSet: { friends: [req.body.userId] } }
      );
      // })
      // .then(() => {
      res.status(200).send({ message: "Friend Request Accepted" });
      // });
      //   await reqAccept.save();
    } else if (
      user.friendRequests.includes(req.body.friendId) &&
      req.body.status === "delete"
    ) {
      await user.updateOne({ $pull: { friendRequests: req.body.friendId } });
      user.save();
      res.status(200).send({ message: "Friend Request Deleted" });
    } else {
      res.status(404).send({ message: "Friend Request does not exist" });
    }
  } catch (error) {
    // console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = { sendRequest, acceptRequest, showRequests };
