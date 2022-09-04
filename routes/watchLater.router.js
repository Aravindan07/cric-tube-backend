const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { watchLaterController } = require("../controllers/watchLater.controller");
const { UserIdParamHandler } = require("../middlewares/paramHandler");

// Add/remove from watch later
router.param("userId", UserIdParamHandler);
router.route("/:userId/watch-later").all(checkAuth).post(watchLaterController);

module.exports = router;
