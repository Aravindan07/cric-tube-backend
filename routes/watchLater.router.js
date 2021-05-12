const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const User = require("../models/user.model");
const WatchLater = require("../models/watchLater.model");

// Get all watch later videos for a user
router.get("/:userId/watch-later", checkAuth, async (req, res) => {
	const { userId } = req.params;
	try {
		const foundWatchLaterVideo = await WatchLater.findOne({ userId })
			.select("-__v")
			.populate("videos");
		return res.status(200).json({ watchLater: foundWatchLaterVideo });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
});

// Add to watch later
router.post("/:userId/watch-later", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	const user = await User.findOne({ _id: userId });
	const foundWatchLaterVideo = await WatchLater.findOne({ userId });
	if (foundWatchLaterVideo) {
		foundWatchLaterVideo.videos = [...foundWatchLaterVideo.videos, videoId];
		const addedVideo = await foundWatchLaterVideo.save();
		user.watchLater = foundWatchLaterVideo.videos;
		await user.save();
		return res.status(201).json({ message: "Added to watch later", addedVideo });
	}
	const video = new WatchLater({ userId, videos: [videoId] });
	user.watchLater = video;
	await user.save();
	const newList = await video.save();
	return res.status(201).json({ message: "Added to watch later", newList });
});

// Delete from watch later
router.put("/:userId/remove-watch-later", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	const user = await User.findOne({ _id: userId });
	const foundWatchLaterVideo = await WatchLater.findOne({ userId });
	foundWatchLaterVideo.videos = foundWatchLaterVideo.videos.filter(
		(el) => String(el) !== String(videoId)
	);
	user.watchLater = user.watchLater.filter((el) => String(el) !== String(videoId));
	await user.save();
	const newList = await foundWatchLaterVideo.save();
	return res.status(200).json({ message: "Video removed from watch later", newList });
});

module.exports = router;
