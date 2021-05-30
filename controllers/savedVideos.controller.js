const SavedVideo = require("../models/savedVideo.model");
const mongoose = require("mongoose");

const SaveVideoController = async (req, res) => {
	const { userId, videoId } = req.body;
	const foundUser = req.foundUser;
	console.log("foundUser", foundUser);
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const foundSavedVideo = await SavedVideo.findOne({ userId });
		if (foundSavedVideo) {
			const alreadyFound = foundSavedVideo.videos.find(
				(el) => String(el) === String(videoId)
			);
			if (alreadyFound) {
				foundSavedVideo.videos = foundSavedVideo.videos.filter(
					(el) => String(el) !== String(videoId)
				);
				await foundUser.save({ session });

				let newList = await foundSavedVideo.save({ session });
				newList = await newList.populate("videos").execPopulate();
				session.commitTransaction();
				return res
					.status(201)
					.json({ message: "Removed from saved videos", item: newList });
			}
			foundSavedVideo.videos = foundSavedVideo.videos.concat(videoId);
			let updatedList = await foundSavedVideo.save({ session });
			updatedList = await updatedList.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ message: "Added to saved videos", item: updatedList });
		}
		const newSavedVideo = new SavedVideo({ userId, videos: [videoId] });
		foundUser.savedVideos = newSavedVideo;
		await foundUser.save();
		let updatedDoc = await newSavedVideo.save();
		updatedDoc = await updatedDoc.populate("videos").execPopulate();
		session.commitTransaction({ session });
		return res.status(201).json({ message: "Added to saved videos", item: updatedDoc });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while fetching data" });
	}
};

module.exports = { SaveVideoController };
