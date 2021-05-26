const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { likeVideoController } = require("../controllers/likeVideos.controller");
const { likeOrDislikeVideoParamHandler } = require("../middlewares/paramHandler");

router.param("userId", likeOrDislikeVideoParamHandler);
router.route("/:userId/:videoId/like").all(checkAuth).post(likeVideoController);

module.exports = router;
