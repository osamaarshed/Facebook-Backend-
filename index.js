const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const port = 8080;

//Importing Routes
const signup = require("./Routes/signup.js");
const signin = require("./Routes/signin.js");
const posts = require("./Routes/posts.js");
const comments = require("./Routes/comments.js");
const likes = require("./Routes/likes.js");
// const

mongoose.connect("mongodb://localhost:27017/facebook");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Routes
app.use("/signup", signup);
app.use("/signin", signin);
app.use("/posts", posts);
app.use("/comments", comments);
// app.use("/likes", likes);

app.listen(port, () => {
  console.log("Running on port: " + port);
});
