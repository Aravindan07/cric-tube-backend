const Playlist = require("../models/playlist.model");
const mongoose = require("mongoose");

const postVideoToPlaylist = async (req, res) => {
	const { userId, videoId, playlistName } = req.body;
	const allPlaylistsByUser = await Playlist.findOne({ userId });
	const foundUser = req.foundUser;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		if (!allPlaylistsByUser) {
			const newPlaylist = new Playlist({
				userId,
				playlists: [{ playlistName, videos: [videoId] }],
			});
			foundUser.playlists = newPlaylist;
			await foundUser.save({ session });
			let newList = await newPlaylist.save({ session });
			newList = await newList.populate("playlists.videos").execPopulate();
			session.commitTransaction();
			return res.status(201).json({ message: "Video added to playlist", item: newList });
		}

		// Add a new playlist object in playlists
		if (allPlaylistsByUser && allPlaylistsByUser.playlists.length >= 0) {
			allPlaylistsByUser.playlists.push({
				playlistName,
				videos: [videoId],
			});
			let newList = await allPlaylistsByUser.save({ session });
			newList = await newList.populate("playlists.videos").execPopulate();
			session.commitTransaction();
			return res.status(200).json({ message: "Video added to playlist", item: newList });
		}
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
};

const addVideoToExistingPlaylist = async (req, res) => {
	const { userId, playlistId, videoId } = req.body;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists.map((el) =>
			String(el._id) === String(playlistId) ? el.videos.push(videoId) : el
		);
		let newList = await allPlaylistsByUser.save({ session });
		newList = await newList.populate("playlists.videos").execPopulate();
		session.commitTransaction();
		return res.json({ message: "Video added to playlist", item: newList });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
};

const editPlaylistName = async (req, res) => {
	const { userId, playlistId, newPlaylistName } = req.body;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists.map((el) =>
			String(el._id) === String(playlistId) ? (el.playlistName = newPlaylistName) : el
		);
		const newList = await allPlaylistsByUser.save({ session });
		session.commitTransaction();
		return res.json({ message: "Changed playlist name", item: newList });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
};

const deletePlaylist = async (req, res) => {
	const { userId, playlistId } = req.body;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists = allPlaylistsByUser.playlists.filter((el) => {
			return String(el._id) !== String(playlistId);
		});
		let newList = await allPlaylistsByUser.save({ session });
		newList = await newList.populate("playlists.videos").execPopulate();
		session.commitTransaction();
		return res.json({
			message: "Playlist deleted",
			item: newList,
			clickedPlaylist: playlistId,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
};

const deleteVideoFromPlaylist = async (req, res) => {
	const { userId, playlistId, videoId } = req.body;
	try {
		const session = await mongoose.startSession();
		session.startTransaction();
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists.map((el) => {
			if (String(el._id) === String(playlistId)) {
				return (el.videos = el.videos.filter((video) => String(video) !== String(videoId)));
			}
			return el;
		});
		let newList = await allPlaylistsByUser.save({ session });
		newList = await newList.populate("playlists.videos").execPopulate();
		session.commitTransaction();
		return res.json({
			message: "Video deleted from playlist",
			item: newList,
			clickedPlaylist: playlistId,
			clickedVideo: videoId,
		});
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
};

module.exports = {
	postVideoToPlaylist,
	addVideoToExistingPlaylist,
	editPlaylistName,
	deletePlaylist,
	deleteVideoFromPlaylist,
};
