const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    // likes: { type: Number },
    likes: [{ type: String }],
    likeCount: { type: Number },
    comments: [{ type: "ObjectId", ref: "Comments" }],
    shares: { type: Number },
    userId: { type: "ObjectId", ref: "Authentication" },
    postDescription: { type: String },
  },
  {
    collection: "Posts",
  }
);
const Posts = mongoose.model("Posts", postsSchema);
module.exports = Posts;
