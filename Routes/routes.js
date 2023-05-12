const express = require("express");
const router = express.Router();

const app = express();
const { authenticate } = require("../Middlewares/token");
const user = require("./user");
const posts = require("./posts");
const comments = require("./comments");
const addFriends = require("./addFriends");
const constants = require("../constants");
const ErrorHandler = require("../Middlewares/errorHandling");

router.use("/", user, ErrorHandler);
router.use("/posts", authenticate, posts, ErrorHandler);
router.use("/comments", authenticate, comments, ErrorHandler);
router.use("/addfriends", authenticate, addFriends, ErrorHandler);

module.exports = router;
