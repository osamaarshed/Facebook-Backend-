const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Authentication = require("../Models/Authentication");

//Show
router.get("/", async (req, res) => {
  try {
    const users = await Authentication.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
});
//Create
router.post("/", async (req, res) => {
  try {
    const password = await bcrypt.hash(req.body.password, 10);

    const confirmpassword = await bcrypt.hash(req.body.confirmpassword, 10);

    if (req.body.password === req.body.confirmpassword) {
      await Authentication.create({
        name: req.body.name,
        email: req.body.email,
        password: password,
        confirmpassword: confirmpassword,
      }).then(() => {
        res.status(201).send({ message: "User Created" });
      });
    } else {
      res.status(401).send({ message: "Unauthorized" });
    }
  } catch (error) {
    res.send({ message: error });
  }
});

module.exports = router;
