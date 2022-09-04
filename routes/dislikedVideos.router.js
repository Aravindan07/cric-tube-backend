const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { dislikeVideoController } = require("../controllers/dislikeVideos.controller");
const { likeOrDislikeVideoParamHandler } = require("../middlewares/paramHandler");

router.param("userId", likeOrDislikeVideoParamHandler);
router.route("/:userId/:videoId/dislike").all(checkAuth).post(dislikeVideoController);

module.exports = router;
