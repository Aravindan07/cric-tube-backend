const Video = require("../models/video.model");

const getVideos = async (req, res) => {
	try {
		const videos = await Video.find({}).select("-__v");
		return res.status(200).json({ videos });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ message: "An Error Occurred" });
	}
};

const postVideo = async (req, res) => {
	const receivedData = req.body;
	try {
		const newVideo = new Video({ ...receivedData });
		const savedVideo = await newVideo.save();
		return res.status(201).json({ message: "Video Uploaded", item: savedVideo });
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error });
	}
};

module.exports = { getVideos, postVideo };
