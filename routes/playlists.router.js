const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Playlist = require("../models/playlist.model");
const checkAuth = require("../middlewares/checkAuth");
const Video = require("../models/video.model");

// Post a video to playlist
router.post("/:userId/playlists", checkAuth, async (req, res) => {
	const { userId, videoId, playlistName } = req.body;
	const allPlaylistsByUser = await Playlist.findOne({ userId });
	const foundUser = await User.findOne({ _id: userId });
	try {
		if (!allPlaylistsByUser) {
			const newPlaylist = new Playlist({
				userId,
				playlists: [{ playlistName, videos: [videoId] }],
			});
			foundUser.playlists = newPlaylist;
			await foundUser.save();
			let newList = await newPlaylist.save();
			newList = await newList.populate("playlists.videos").execPopulate();
			return res.status(201).json({ message: "Video added to playlist", item: newList });
		}

		// Add a new playlist object in playlists
		if (allPlaylistsByUser && allPlaylistsByUser.playlists.length >= 0) {
			allPlaylistsByUser.playlists.push({
				playlistName,
				videos: [videoId],
			});
			let newList = await allPlaylistsByUser.save();
			newList = await newList.populate("playlists.videos").execPopulate();
			return res.status(200).json({ message: "Video added to playlist", item: newList });
		}
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
});

// Add a video to an existing playlist
router.put("/:userId/playlists/:playlistId", checkAuth, async (req, res) => {
	const { userId, playlistId, videoId } = req.body;
	try {
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists.map((el) =>
			String(el._id) === String(playlistId) ? el.videos.push(videoId) : el
		);
		let newList = await allPlaylistsByUser.save();
		newList = await newList.populate("playlists.videos").execPopulate();
		return res.json({ message: "Video added to playlist", item: newList });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
});

//Edit playlist name
router.put("/:userId/playlists/:playlistId/edit-name", checkAuth, async (req, res) => {
	const { userId, playlistId, newPlaylistName } = req.body;
	try {
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists.map((el) =>
			String(el._id) === String(playlistId) ? (el.playlistName = newPlaylistName) : el
		);
		const newList = await allPlaylistsByUser.save();
		return res.json({ message: "Changed playlist name", item: newList });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
});

// Delete a playlist
router.put("/:userId/playlists/:playlistId/delete", checkAuth, async (req, res) => {
	const { userId, playlistId } = req.body;
	try {
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists = allPlaylistsByUser.playlists.filter((el) => {
			return String(el._id) !== String(playlistId);
		});
		let newList = await allPlaylistsByUser.save();
		newList = await newList.populate("playlists.videos").execPopulate();
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
});

// Delete a video from a playlist
router.put("/:userId/playlists/:playlistId/:videoId/delete", checkAuth, async (req, res) => {
	const { userId, playlistId, videoId } = req.body;
	try {
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		allPlaylistsByUser.playlists.map((el) => {
			if (String(el._id) === String(playlistId)) {
				return (el.videos = el.videos.filter((video) => String(video) !== String(videoId)));
			}
			return el;
		});
		let newList = await allPlaylistsByUser.save();
		newList = await newList.populate("playlists.videos").execPopulate();
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
});

module.exports = router;
