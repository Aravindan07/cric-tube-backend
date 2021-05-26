const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();
const { SaveVideoController } = require("../controllers/savedVideos.controller");
const { UserIdParamHandler } = require("../middlewares/paramHandler");

// Save/UnSave a video
router.param("userId", UserIdParamHandler);
router.route("/:userId/save-videos").all(checkAuth).post(SaveVideoController);

module.exports = router;
