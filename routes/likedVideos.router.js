const express = require("express");
const router = express.Router();
const LikedVideo = require("../models/likedVideo.model");
const DislikedVideo = require("../models/dislikeVideo.model");
const User = require("../models/user.model");
const Video = require("../models/video.model");
const checkAuth = require("../middlewares/checkAuth");

router.post("/:userId/:videoId/like", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	try {
		const foundVideo = await Video.findById({ _id: videoId });
		const foundUser = await User.findById({ _id: userId });
		const foundLikedVideo = await LikedVideo.findOne({ userId });
		const foundDislikedVideo = await DislikedVideo.findOne({ userId });
		const checkPresent =
			foundLikedVideo && foundLikedVideo.videos.find((el) => String(el) === String(videoId));
		const checkInDislikedVideos =
			foundDislikedVideo &&
			foundDislikedVideo.videos.find((el) => String(el) === String(videoId));
		if (checkPresent) {
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
			if (checkInDislikedVideos) {
				foundVideo.dislikes = foundVideo.dislikes - 1;
				foundDislikedVideo.videos = foundDislikedVideo.videos.filter(
					(el) => String(el) !== String(videoId)
				);
				await foundDislikedVideo.save();
			}
			foundVideo.likes = foundVideo.likes + 1;
			await foundVideo.save();
			foundLikedVideo.videos.push(videoId);
			let newLikedVideos = await foundLikedVideo.save();
			newLikedVideos = await newLikedVideos.populate("videos").execPopulate();
			return res.status(201).json({
				message: "Added to liked videos",
				item: newLikedVideos,
				clickedVideo: videoId,
			});
		}
		const videoToAdd = new LikedVideo({ userId, videos: [videoId] });
		if (checkInDislikedVideos) {
			foundVideo.dislikes = foundVideo.dislikes - 1;
			foundDislikedVideo.videos = foundDislikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
			await foundDislikedVideo.save();
		}
		foundVideo.likes = foundVideo.likes + 1;
		foundUser.likedVideos = videoToAdd;
		await foundVideo.save();
		await foundUser.save();
		let savedVideo = await videoToAdd.save();
		savedVideo = await savedVideo.populate("videos").execPopulate();
		return res
			.status(201)
			.json({ message: "Added to liked videos", item: savedVideo, clickedVideo: videoId });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
	return res.status(201).json;
});

module.exports = router;
