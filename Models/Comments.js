const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema(
  {
    comment: { type: String, required: true },
    userId: { type: "ObjectId", ref: "Authentication", required: true },
    postId: { type: "ObjectId", ref: "Posts", required: true },
  },
  {
    collection: "Comments",
  }
);
const Comments = mongoose.model("Comments", commentsSchema);
module.exports = Comments;
