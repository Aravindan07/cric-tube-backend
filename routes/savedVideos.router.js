const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();
const SavedVideo = require("../models/savedVideo.model");
const User = require("../models/user.model");

// Get all saved Videos
router.get("/:userId/get-saved-videos", checkAuth, async (req, res) => {
	const { userId } = req.params;
	try {
		const savedVideos = await SavedVideo.findOne({ userId }).select("-__v").populate("videos");
		res.status(200).json({ savedVideos });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while fetching data" });
	}
});

// Save/UnSave a video
router.post("/:userId/save-videos", checkAuth, async (req, res) => {
	const { userId, videoId } = req.body;
	try {
		const foundSavedVideo = await SavedVideo.findOne({ userId });
		const foundUser = await User.findById({ _id: userId });
		if (foundSavedVideo) {
			const alreadyFound = foundSavedVideo.videos.find(
				(el) => String(el) === String(videoId)
			);
			if (alreadyFound) {
				foundSavedVideo.videos = foundSavedVideo.videos.filter(
					(el) => String(el) !== String(videoId)
				);
				foundUser.savedVideos = foundUser.savedVideos.filter(
					(el) => String(el) !== String(videoId)
				);
				await foundUser.save();
				const newList = await foundSavedVideo.save();
				return res
					.status(201)
					.json({ message: "Added to saved videos", savedVideos: newList });
			}
			foundSavedVideo.videos = foundSavedVideo.videos.concat(videoId);
			foundUser.savedVideos = foundUser.savedVideos.concat(foundSavedVideo);
			await foundUser.save();
			const newList = await foundSavedVideo.save();
			console.log("Inside my preferred!,1");
			return res.status(201).json({ message: "Added to saved videos", savedVideos: newList });
		}
		const newSavedVideo = new SavedVideo({ userId, videos: [videoId] });
		foundUser.savedVideos = newSavedVideo;
		console.log("Inside my preferred!,1");
		const newList = await newSavedVideo.save();
		await foundUser.save();
		return res.status(201).json({ message: "Added to saved videos", savedVideos: newList });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while fetching data" });
	}
});

module.exports = router;
