// const express = require("express");
// const router = express.Router();
// const Likes = require("../Models/Likes");
// const Posts = require("../Models/Posts");

// //Show
// router.get("/", async (req, res) => {
//   try {
//     const likes = await Likes.find({}).populate("userId").populate("postId");
//     res.status(200).send(likes);
//   } catch (error) {
//     res.status(404).send({ message: "Not Found" });
//   }
// });

// //Create
// router.post("/", async (req, res) => {
//   //   const payload = {
//   //     likes: req.body.likes,
//   //     userId: req.body.userId,
//   //     postId: req.body.postId,

//   //     // likes: userId,
//   //   };
//   try {
//     if (req.body.likes === "true") {
//       await Likes.create({
//         likes: req.body.likes,
//         userId: req.body.userId,
//         postId: req.body.postId,
//       })
//         .then(async () => {
//           await Likes.findOneAndUpdate(
//             { postId: req.body.postId },
//             {
//               $addToSet: {
//                 likesData: req.body.userId,
//               },
//             },
//             { new: true }
//           );
//         })
//         .then(async () => {
//           const size = await Likes.findOne({ postid: req.body.postId });
//           await Posts.findOneAndUpdate(
//             { _id: req.body.postId },
//             { $push: { likes: size.likesData.length() } },
//             { new: true }
//           );
//         })
//         .then(() => {
//           res.status(200).send({ message: "Like Added" });
//         });
//       //   });
//     } else {
//       res.send({ message: "Like Did not Added because it was false" });
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(404).send({ message: "Not Found" });
//   }
// });

// module.exports = router;

// //
