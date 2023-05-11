const express = require("express");
const Authentication = require("../Models/Authentication");
const bcrypt = require("bcrypt");

const showUsers = async (req, res) => {
  try {
    const users = await Authentication.find({});
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send({ message: "Not Found" });
  }
};

const signUp = async (req, res) => {
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
};

const signIn = async (req, res) => {
  try {
    const user = await Authentication.findOne({ email: req.body.email });
    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordValid) {
      await user.updateOne({ jwttoken: req.jwttoken });
      user.save();
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
};

module.exports = { showUsers, signUp, signIn };
