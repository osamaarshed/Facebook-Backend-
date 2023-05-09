const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const Authentication = require("../Models/Authentication");

router.post("/", async (req, res) => {
  try {
    const user = await Authentication.findOne({ email: req.body.email });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      res.status(200).send({
        status: "Ok",
        message: "User Found",
        userInfo: user,
      });
    } else {
      res.status(401).send({ status: "Wrong Password" });
    }
  } catch (error) {
    res.status(404).send({ status: "Not Found", message: error });
  }
});
module.exports = router;
