const DislikedVideo = require("../models/dislikeVideo.model");
const mongoose = require("mongoose");

const dislikeVideoController = async (req, res) => {
	const { userId, videoId } = req.body;
	const foundVideo = req.foundVideo;
	const foundUser = req.foundUser;
	const foundDislikedVideo = req.foundDislikedVideo;
	const foundLikedVideo = req.foundLikedVideo;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const checkPresent =
			foundDislikedVideo &&
			foundDislikedVideo.videos.find((el) => String(el) === String(videoId));
		const checkInLikedVideos =
			foundLikedVideo && foundLikedVideo.videos.find((el) => String(el) === String(videoId));
		if (checkPresent) {
			foundDislikedVideo.videos = foundDislikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
			foundVideo.dislikes = foundVideo.dislikes - 1;
			await foundVideo.save({ session });
			let newDislikedVideos = await foundDislikedVideo.save({ session });
			newDislikedVideos = await newDislikedVideos.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ item: newDislikedVideos, clickedVideo: videoId });
		}

		if (foundDislikedVideo) {
			if (checkInLikedVideos) {
				foundVideo.likes = foundVideo.likes - 1;
				foundLikedVideo.videos = foundLikedVideo.videos.filter(
					(el) => String(el) !== String(videoId)
				);
				await foundLikedVideo.save({ session });
			}
			foundVideo.dislikes = foundVideo.dislikes + 1;
			await foundVideo.save({ session });
			foundDislikedVideo.videos.push(videoId);
			let newDislikedVideos = await foundDislikedVideo.save({ session });
			newDislikedVideos = await newDislikedVideos.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ item: newDislikedVideos, clickedVideo: videoId });
		}
		const videoToAdd = new DislikedVideo({ userId, videos: [videoId] });
		if (checkInLikedVideos) {
			foundVideo.likes = foundVideo.likes - 1;
			foundLikedVideo.videos = foundLikedVideo.videos.filter(
				(el) => String(el) !== String(videoId)
			);
			await foundLikedVideo.save({ session });
			session.commitTransaction();
		}
		foundVideo.dislikes = foundVideo.dislikes + 1;
		foundUser.dislikedVideos = videoToAdd;
		await foundVideo.save({ session });
		await foundUser.save({ session });
		let savedVideo = await videoToAdd.save({ session });
		savedVideo = await savedVideo.populate("videos").execPopulate();
		session.commitTransaction();
		return res.status(201).json({ item: savedVideo, clickedVideo: videoId });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
};

module.exports = { dislikeVideoController };
