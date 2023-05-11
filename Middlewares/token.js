const express = require("express");
const Authentication = require("../Models/Authentication");
const jwt = require("jsonwebtoken");

const tokenSign = async (req, res, next) => {
  const [user] = await Authentication.find({ email: req.body.email });
  const payload = {
    _id: user._id,
  };
  const token = jwt.sign(payload, "thisisthesecretkey12345");
  req.jwttoken = token;
  next();
};

module.exports = { tokenSign };
