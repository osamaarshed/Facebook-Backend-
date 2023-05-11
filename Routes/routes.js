const express = require("express");
const router = express.Router();

const app = express();
const { authenticate } = require("../Middlewares/token");
const user = require("./user");
const posts = require("./posts");
const comments = require("./comments");
const addFriends = require("./addFriends");

router.use("/", user);
router.use("/posts", authenticate, posts);
router.use("/comments", authenticate, comments);
router.use("/addfriends", authenticate, addFriends);

module.exports = router;
