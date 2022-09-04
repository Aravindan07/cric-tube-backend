const LikedVideo = require("../models/likedVideo.model");
const mongoose = require("mongoose");

const likeVideoController = async (req, res) => {
	const { userId, videoId } = req.body;
	const foundVideo = req.foundVideo;
	const foundUser = req.foundUser;
	const foundLikedVideo = req.foundLikedVideo;
	const foundDislikedVideo = req.foundDislikedVideo;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
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
			await foundVideo.save({ session });
			let newLikedVideos = await foundLikedVideo.save({ session });
			newLikedVideos = await newLikedVideos.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ item: newLikedVideos, clickedVideo: videoId });
		}
		if (foundLikedVideo) {
			if (checkInDislikedVideos) {
				foundVideo.dislikes = foundVideo.dislikes - 1;
				foundDislikedVideo.videos = foundDislikedVideo.videos.filter(
					(el) => String(el) !== String(videoId)
				);
				await foundDislikedVideo.save({ session });
			}
			foundVideo.likes = foundVideo.likes + 1;
			await foundVideo.save({ session });
			foundLikedVideo.videos.push(videoId);
			let newLikedVideos = await foundLikedVideo.save({ session });
			newLikedVideos = await newLikedVideos.populate("videos").execPopulate();
			session.commitTransaction();
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
			await foundDislikedVideo.save({ session });
			session.commitTransaction();
		}
		foundVideo.likes = foundVideo.likes + 1;
		await foundVideo.save({ session });
		foundUser.likedVideos = videoToAdd;
		await foundUser.save({ session });
		let savedVideo = await videoToAdd.save({ session });
		savedVideo = await savedVideo.populate("videos").execPopulate();
		session.commitTransaction();
		return res
			.status(201)
			.json({ message: "Added to liked videos", item: savedVideo, clickedVideo: videoId });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred" });
	}
};

module.exports = { likeVideoController };
