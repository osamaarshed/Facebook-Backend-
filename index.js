const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const port = 8080;

//Importing Routes
const routes = require("./Routes/routes");

mongoose.connect("mongodb://localhost:27017/facebook");

//Routes
app.use("/", routes);
app.listen(port, () => {
  console.log("Running on port: " + port);
});
