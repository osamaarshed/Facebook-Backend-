const mongoose = require("mongoose");

const authenticationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
    friends: [{ type: "ObjectId", ref: "Authentication", default: "ah" }],
    friendRequests: [
      { type: "ObjectId", ref: "Authentication", default: "ah" },
    ],
  },
  {
    collection: "credentials",
  }
);
const Authentication = mongoose.model("Authentication", authenticationSchema);
module.exports = Authentication;
