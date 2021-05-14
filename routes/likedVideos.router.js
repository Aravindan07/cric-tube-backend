const express = require("express");
const router = express.Router();
const LikedVideo = require("../models/likedVideo.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");
const checkAuth = require("../middlewares/checkAuth");

router.get("/:userId/liked-videos", checkAuth, async (req, res) => {
	const { userId } = req.params;
	try {
		const likedVideos = await LikedVideo.find({ userId: userId })
			.select("-__v")
			.populate("videos");
		res.status(200).json({ likedVideos });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
});

router.post("/:userId/:videoId/like", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	try {
		const foundVideo = await Video.findById({ _id: videoId });
		const foundUser = await User.findById({ _id: userId });
		const foundLikedVideo = await LikedVideo.findOne({ userId });
		const checkPresent =
			foundLikedVideo && foundLikedVideo.videos.find((el) => String(el) === String(videoId));
		if (checkPresent) {
			foundLikedVideo.videos = foundLikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
			foundUser.likedVideos = foundUser.likedVideos.filter(
				(el) => String(el) !== String(videoId)
			);
			foundVideo.likes = foundVideo.likes - 1;
			await foundVideo.save();
			await foundUser.save();
			const newLikedVideos = await foundLikedVideo.save();
			return res.status(201).json({ likedVideos: newLikedVideos });
		}
		if (foundLikedVideo) {
			foundLikedVideo.videos = [...foundLikedVideo.videos, videoId];
			const newLikedVideos = await foundLikedVideo.save();
			foundVideo.likes = foundVideo.likes + 1;
			foundUser.likedVideos.push(foundLikedVideo);
			await foundVideo.save();
			await foundUser.save();
			return res.status(201).json({ message: "Added to liked videos", item: newLikedVideos });
		}
		const videoToAdd = new LikedVideo({ userId, videos: [videoId] });
		foundVideo.likes = foundVideo.likes + 1;
		foundUser.likedVideos.push(videoToAdd);
		await foundVideo.save();
		await foundUser.save();
		const savedVideo = await videoToAdd.save();
		return res.status(201).json({ message: "Added to liked videos", item: savedVideo });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
	return res.status(201).json;
});

module.exports = router;
