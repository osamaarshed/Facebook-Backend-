const express = require("express");
const Messages = require("../Models/Messages");
const { Success_Messages } = require("../constants");

//Show All Messages
const showMessages = async (req, res, next) => {
  try {
    const messages = await Messages.find({
      participants: { $in: [req.user] },
    })
      .populate("participants")
      .populate("messages.sentBy");
    if (messages.length) {
      res
        .status(200)
        .send({ message: "SuccessFully Fetched", chats: messages });
    } else {
      res.status(400).send({ message: "No Chats" });
    }
  } catch (error) {
    next(error);
  }
};

const saveMessages = async (data) => {
  try {
    const chatId = await Messages.findOne({
      chatRoomId: data.chatRoomId,
    });
    if (!chatId) {
      const res = await Messages.create({
        chatRoomId: data.chatRoomId,
        participants: [data.participant1, data.participant2],
        messages: [
          {
            sentBy: data.messageOwner,
            text: data.text,
            timeStamp: data.time,
          },
        ],
      });
      if (res) {
        console.log("Message Sent");
        return res;
      } else {
        console.log("Bad Request in ifelse");
      }
    } else {
      const payload = {
        sentBy: data.messageOwner,
        text: data.text,
        timeStamp: data.time,
      };
      const addMessage = await Messages.findOneAndUpdate(
        {
          chatRoomId: data.chatRoomId,
        },
        {
          $push: { messages: payload },
        },
        { new: true }
      )
        .populate("participants")
        .populate("messages.sentBy");
      if (addMessage) {
        return addMessage;
      } else {
        console.log("Bad Request");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// const saveMessage = async (req, res, next) => {
//   try {
//     const chatId = await Messages.findOne({
//       chatRoomId: req.body.chatRoomId,
//     });
//     if (!chatId) {
//       // console.log("Herer");
//       const data = await Messages.create({
//         chatRoomId: req.body.chatRoomId,
//         participants: [req.user, req.body.participant2],
//         messages: [
//           {
//             sentBy: req.body.messageOwner,
//             text: req.body.text,
//             timeStamp: req.body.time,
//           },
//         ],
//       });
//       // console.log("data", data);
//       if (data) {
//         console.log("Message Sent");
//         res.status(200).send({ message: Success_Messages.Created, data: data });
//       } else {
//         // console.log("ifelse");
//         res.status(400).send({ message: "Bad Request in ifelse" });
//       }
//     } else {
//       const payload = {
//         sentBy: req.body.messageOwner,
//         text: req.body.text,
//       };
//       const addMessage = await Messages.findOneAndUpdate(
//         {
//           chatRoomId: req.body.chatRoomId,
//         },
//         {
//           $push: { messages: payload },
//         },
//         { new: true }
//       );
//       if (addMessage) {
//         res.status(200).send({ message: "Message Sent Successfully" });
//       } else {
//         res.status(400).send({ message: "Bad Request" });
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };

// const saveMessage = async (req, res, next) => {
//   try {
//     const chatId = await Messages.findOne({
//       chatRoomId: req.params.chatRoomId,
//     });
//     if (!chatId) {
//       const data = await Messages.create({
//         chatRoomId: req.params.chatRoomId,
//         participant1: req.user,
//         participant2: req.params.participant2,
//         messages: [
//           {
//             sentBy: req.params.messageOwner,
//             text: req.body.text,
//             timeStamp: req.body.time,
//           },
//         ],
//       });
//       if (data) {
//         console.log("Message Sent");
//         res.status(200).send({ message: Success_Messages.Created, data: data });
//       }
//     } else {
//       const payload = {
//         sentBy: req.params.messageOwner,
//         text: req.body.text,
//       };
//       const addMessage = await Messages.findOneAndUpdate(
//         {
//           chatRoomId: req.params.chatRoomId,
//         },
//         {
//           $push: { messages: payload },
//         },
//         { new: true }
//       );
//       if (addMessage) {
//         res.status(200).send({ message: "Message Sent Successfully" });
//       } else {
//         res.status(400).send({ message: "Bad Request" });
//       }
//     }
//   } catch (error) {
//     next(error);
//   }
// };

module.exports = {
  showMessages,
  // saveMessage,
  saveMessages,
};
