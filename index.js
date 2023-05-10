const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 8080;

//Importing Routes
const user = require("./Routes/user.js");
const posts = require("./Routes/posts.js");
const comments = require("./Routes/comments.js");
const addFriends = require("./Routes/addFriends.js");

mongoose.connect("mongodb://localhost:27017/facebook");

//Routes
// app.use("/signup", user);
app.use("/", user);
app.use("/", posts);
app.use("/", comments);
app.use("/", addFriends);
// app.use("/likes", likes);

app.listen(port, () => {
  console.log("Running on port: " + port);
});
