const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const User = require("../models/user.model");
const WatchLater = require("../models/watchLater.model");

// Add to watch later
router.post("/:userId/watch-later", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	const user = await User.findOne({ _id: userId });
	const foundWatchLaterVideo = await WatchLater.findOne({ userId });
	const checkPresent =
		foundWatchLaterVideo &&
		foundWatchLaterVideo.videos.find((el) => String(el) === String(videoId));
	try {
		if (checkPresent) {
			foundWatchLaterVideo.videos = foundWatchLaterVideo.videos.filter(
				(el) => String(el._id) !== String(videoId)
			);
			let newList = await foundWatchLaterVideo.save();
			newList = await newList.populate("videos").execPopulate();
			return res.status(200).json({
				message: "Removed from watch later",
				item: newList,
				clickedVideo: videoId,
			});
		}
		if (foundWatchLaterVideo) {
			foundWatchLaterVideo.videos = [...foundWatchLaterVideo.videos, videoId];
			let addedVideo = await foundWatchLaterVideo.save();
			addedVideo = await addedVideo.populate("videos").execPopulate();
			return res.status(201).json({ message: "Added to watch later", item: addedVideo });
		}
		const video = new WatchLater({ userId, videos: [videoId] });
		user.watchLater = video;
		await user.save();
		let newList = await video.save();
		newList = await newList.populate("videos").execPopulate();
		return res.status(201).json({ message: "Added to watch later", item: newList });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
});

module.exports = router;
