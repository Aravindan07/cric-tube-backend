const History = require("../models/history.model");
const mongoose = require("mongoose");

const historyController = async (req, res) => {
	const { userId, videoId } = req.body;
	const foundUser = req.foundUser;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const foundVideoInHistory = await History.findOne({ userId });
		if (foundVideoInHistory) {
			const alreadyFound = foundVideoInHistory.videos.find(
				(el) => String(el) === String(videoId)
			);
			if (alreadyFound) {
				foundVideoInHistory.videos = foundVideoInHistory.videos.filter(
					(el) => String(el) !== String(videoId)
				);
				await foundUser.save({ session });

				let newList = await foundVideoInHistory.save({ session });
				newList = await newList.populate("videos").execPopulate();
				session.commitTransaction();
				return res
					.status(201)
					.json({ message: "Video removed from History", item: newList });
			}
			foundVideoInHistory.videos = foundVideoInHistory.videos.concat(videoId);
			let updatedList = await foundVideoInHistory.save({ session });
			updatedList = await updatedList.populate("videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ message: "Video Added to History", item: updatedList });
		}
		const newVideoInHistory = new History({ userId, videos: [videoId] });
		foundUser.history = newVideoInHistory;
		await foundUser.save({ session });
		let updatedDoc = await newVideoInHistory.save({ session });
		updatedDoc = await updatedDoc.populate("videos").execPopulate();
		session.commitTransaction({ session });
		return res.status(201).json({ message: "Video Added to History", item: updatedDoc });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while fetching data" });
	}
};

module.exports = { historyController };
