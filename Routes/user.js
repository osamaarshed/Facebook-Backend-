const express = require("express");
const router = express.Router();
const { showUsers, signUp, signIn } = require("../Controllers/user-controller");
const { tokenSign } = require("../Middlewares/token");

//Show
router.get("/signup", showUsers, );

//Create
router.post("/signup", signUp);

//Signin
router.post("/signin", tokenSign, signIn);

module.exports = router;
