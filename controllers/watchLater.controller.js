const WatchLater = require("../models/watchLater.model");
const mongoose = require("mongoose");

const watchLaterController = async (req, res) => {
	const { userId, videoId } = req.body;
	const user = req.foundUser;
	const foundWatchLaterVideo = await WatchLater.findOne({ userId });
	const checkPresent =
		foundWatchLaterVideo &&
		foundWatchLaterVideo.videos.find((el) => String(el) === String(videoId));
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		if (checkPresent) {
			foundWatchLaterVideo.videos = foundWatchLaterVideo.videos.filter(
				(el) => String(el._id) !== String(videoId)
			);
			let newList = await foundWatchLaterVideo.save({ session });
			newList = await newList.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(200).json({
				message: "Removed from watch later",
				item: newList,
				clickedVideo: videoId,
			});
		}
		if (foundWatchLaterVideo) {
			foundWatchLaterVideo.videos = [...foundWatchLaterVideo.videos, videoId];
			let addedVideo = await foundWatchLaterVideo.save({ session });
			addedVideo = await addedVideo.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ message: "Added to watch later", item: addedVideo });
		}
		const video = new WatchLater({ userId, videos: [videoId] });
		let newList = await video.save({ session: session });
		user.watchLater = video;
		await user.save({ session });
		newList = await newList.populate("videos").execPopulate();
		session.commitTransaction();
		return res.status(201).json({ message: "Added to watch later", item: newList });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
};

module.exports = { watchLaterController };
