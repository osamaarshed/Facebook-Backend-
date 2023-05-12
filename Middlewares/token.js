const express = require("express");
const User = require("../Models/UserModel");
const jwt = require("jsonwebtoken");
const secretKey = "thisisthesecretkey12345";

const tokenSign = async (req, res, next) => {
  const [user] = await User.find({ email: req.body.email });
  const payload = {
    _id: user._id,
  };
  const token = jwt.sign(payload, secretKey);
  req.jwttoken = token;
  next();
};

const authenticate = async (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        return res.status(401).send("Not Authorized By JWT");
      }
      req.user = user._id;
      // console.log(req.user);
      next();
    });
  } else {
    res.status(401).send("UnAuthorized to Access");
  }
};

module.exports = { tokenSign, authenticate };
