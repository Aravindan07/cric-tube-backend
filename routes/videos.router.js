const express = require("express");
const { getVideos, postVideo } = require("../controllers/videos.controller");
const router = express.Router();

router.route("/").get(getVideos).post(postVideo);

module.exports = router;
