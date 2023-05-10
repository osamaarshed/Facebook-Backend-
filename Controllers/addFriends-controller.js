const express = require("express");
const Authentication = require("../Models/Authentication");

const sendRequest = async (req, res) => {
  try {
    const userId = req.body.userId;
    const friendId = req.body.friendId;

    const user = await Authentication.find({ _id: userId });
    if (!user) {
      res.status(404).send({ message: "User does not exist" });
    }
    const friend = await Authentication.find({ _id: friendId });
    if (!friend) {
      res.status(404).send({ message: "This user does not exist" });
    }
    if (
      user[0].friends.includes(friendId) ||
      user[0].friendRequests.includes(friendId)
    ) {
      res.send({ message: "Friend Request Already Sent" });
    } else {
      user[0].friendRequests.push(friendId);
      await user[0].save();
      res.status(200).send({ message: "Friend Request Added" });
    }
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Not Found" });
  }
};

module.exports = { sendRequest };
