const express = require("express");

const errorHandle = (err, req, res, next) => {
  const errStatus = err.statusCode || 500;
  const errMsg = err.message || "Something Broke";
  res.status(errStatus).send({ message: errMsg });
};

module.exports = errorHandle;
