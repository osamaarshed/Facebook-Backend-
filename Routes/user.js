const express = require("express");
const router = express.Router();
const userController = require("../Controllers/user-controller");

//Show
router.get("/signup", userController.showUsers);

//Create
router.post("/signup", userController.signUp);

//Signin
router.post("/signin", userController.signIn);

module.exports = router;
