const mongoose = require("mongoose");

const authenticationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    confirmpassword: { type: String, required: true },
  },
  {
    collection: "credentials",
  }
);
const Authentication = mongoose.model("Authentication", authenticationSchema);
module.exports = Authentication;
