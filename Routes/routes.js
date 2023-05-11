const express = require("express");
const router = express.Router();
const app = express();

const user = require("./user");
const posts = require("./posts");
const comments = require("./comments");
const addFriends = require("./addFriends");

router.use("/", user);
router.use("/posts", posts);
router.use("/comments", comments);
router.use("/addfriends", addFriends);

module.exports = router;
