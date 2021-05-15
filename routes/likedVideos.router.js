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
			console.log("Inside check present");
			foundLikedVideo.videos = foundLikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
			foundVideo.likes = foundVideo.likes - 1;
			await foundVideo.save();
			let newLikedVideos = await foundLikedVideo.save();
			newLikedVideos = await newLikedVideos.populate("videos").execPopulate();
			return res.status(201).json({ item: newLikedVideos, clickedVideo: videoId });
		}
		if (foundLikedVideo) {
			foundVideo.likes = foundVideo.likes + 1;
			await foundVideo.save();
			foundLikedVideo.videos.push(videoId);
			let newLikedVideos = await foundLikedVideo.save();
			newLikedVideos = await newLikedVideos.populate("videos").execPopulate();
			return res.status(201).json({ message: "Added to liked videos", item: newLikedVideos });
		}
		const videoToAdd = new LikedVideo({ userId, videos: [videoId] });
		foundVideo.likes = foundVideo.likes + 1;
		console.log("foundUser", foundUser);
		foundUser.likedVideos = videoToAdd;
		await foundVideo.save();
		await foundUser.save();
		let savedVideo = await videoToAdd.save();
		savedVideo = await savedVideo.populate("videos").execPopulate();
		return res.status(201).json({ message: "Added to liked videos", item: savedVideo });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
	return res.status(201).json;
});

module.exports = router;
