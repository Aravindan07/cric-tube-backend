const express = require("express");
const router = express.Router();
const DislikedVideo = require("../models/dislikeVideo.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");
const LikedVideo = require("../models/likedVideo.model");
const checkAuth = require("../middlewares/checkAuth");

router.post("/:userId/:videoId/dislike", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	try {
		const foundVideo = await Video.findById({ _id: videoId });
		const foundUser = await User.findById({ _id: userId });
		const foundDislikedVideo = await DislikedVideo.findOne({ userId });
		const foundLikedVideo = await LikedVideo.findOne({ userId });
		const checkPresent =
			foundDislikedVideo &&
			foundDislikedVideo.videos.find((el) => String(el) === String(videoId));
		const checkInLikedVideos =
			foundLikedVideo && foundLikedVideo.videos.find((el) => String(el) === String(videoId));
		if (checkPresent) {
			console.log("Inside check present");
			foundDislikedVideo.videos = foundDislikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
			foundVideo.dislikes = foundVideo.dislikes - 1;
			await foundVideo.save();
			let newDislikedVideos = await foundDislikedVideo.save();
			newDislikedVideos = await newDislikedVideos.populate("videos").execPopulate();
			return res.status(201).json({ item: newDislikedVideos, clickedVideo: videoId });
		}

		if (foundDislikedVideo) {
			if (checkInLikedVideos) {
				foundVideo.likes = foundVideo.likes - 1;
				foundLikedVideo.videos = foundLikedVideo.videos.filter(
					(el) => String(el) !== String(videoId)
				);
			}
			foundVideo.dislikes = foundVideo.dislikes + 1;
			await foundVideo.save();
			await foundLikedVideo.save();
			foundDislikedVideo.videos.push(videoId);
			let newDislikedVideos = await foundDislikedVideo.save();
			newDislikedVideos = await newDislikedVideos.populate("videos").execPopulate();
			return res.status(201).json({ item: newDislikedVideos, clickedVideo: videoId });
		}
		const videoToAdd = new DislikedVideo({ userId, videos: [videoId] });
		if (checkInLikedVideos) {
			foundVideo.likes = foundVideo.likes - 1;
			foundLikedVideo.videos = foundLikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
		}
		foundVideo.dislikes = foundVideo.dislikes + 1;
		foundUser.dislikedVideos = videoToAdd;
		await foundVideo.save();
		await foundLikedVideo.save();
		await foundUser.save();
		let savedVideo = await videoToAdd.save();
		savedVideo = await savedVideo.populate("videos").execPopulate();
		return res.status(201).json({ item: savedVideo, clickedVideo: videoId });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
	return res.status(201).json;
});

module.exports = router;
