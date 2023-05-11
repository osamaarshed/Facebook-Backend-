const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user-controller");
const token = require("../Middlewares/token");

//Show
router.get("/signup", userController.showUsers);

//Create
router.post("/signup", userController.signUp);

//Signin
router.post("/signin", token.tokenSign, userController.signIn);

module.exports = router;
