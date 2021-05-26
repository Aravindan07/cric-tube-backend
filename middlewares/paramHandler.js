const User = require("../models/user.model");
const Video = require("../models/video.model");
const LikedVideo = require("../models/likedVideo.model");
const DislikedVideo = require("../models/dislikeVideo.model");

const UserIdParamHandler = async (req, res, next, userId) => {
	try {
		const foundUser = await User.findById({ _id: userId });
		if (!foundUser) {
			return res.status(404).json({ message: "User not found!" });
		}
		req.foundUser = foundUser;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
};

const likeOrDislikeVideoParamHandler = async (req, res, next, userId) => {
	const { videoId } = req.params;
	const foundVideo = await Video.findById({ _id: videoId });
	const foundUser = await User.findById({ _id: userId });
	const foundLikedVideo = await LikedVideo.findOne({ userId });
	const foundDislikedVideo = await DislikedVideo.findOne({ userId });
	try {
		if (!foundVideo) {
			return res.status(404).json({ message: "Video not found" });
		}
		req.foundVideo = foundVideo;
		req.foundUser = foundUser;
		req.foundLikedVideo = foundLikedVideo;
		req.foundDislikedVideo = foundDislikedVideo;
		next();
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
};

module.exports = { UserIdParamHandler, likeOrDislikeVideoParamHandler };
