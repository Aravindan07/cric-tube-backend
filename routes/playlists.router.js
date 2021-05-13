const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const Playlist = require("../models/playlist.model");
const checkAuth = require("../middlewares/checkAuth");
const Video = require("../models/video.model");

// Get playlist by userId
router.get("/:userId/get-playlists", checkAuth, async (req, res) => {
	const { userId } = req.params;
	try {
		const allPlaylistsByUser = await Playlist.findOne({ userId })
			.select("-__v")
			.populate("playlists.videos");
		if (allPlaylistsByUser) {
			return res.status(200).json({ playlists: allPlaylistsByUser });
		}
		return res.status(404).json({ message: "No Playlists found" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error while fetching data!" });
	}
});

// Get playlist by playlistId
router.get("/:userId/get-playlists", checkAuth, async (req, res) => {
	const { userId } = req.params;
	try {
		const allPlaylistsByUser = await Playlist.findOne({ userId });
		if (allPlaylistsByUser) {
			return res.status(200).json({ playlists: allPlaylistsByUser });
		}
		return re.status(404).json({ message: "No Playlists found" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Error while fetching data!" });
	}
});

// Post a video to playlist
router.post("/:userId/playlists", checkAuth, async (req, res) => {
	const { userId, videoId, playlistName } = req.body;
	const allPlaylistsByUser = await Playlist.findOne({ userId });
	console.log("allPlaylistsByUser", allPlaylistsByUser);
	const foundUser = await User.findOne({ _id: userId });
	console.log("foundUser", foundUser);
	const foundVideo = await Video.findById({ _id: videoId });
	console.log("foundVideo", foundVideo);
	const foundPlaylist =
		(await allPlaylistsByUser) &&
		allPlaylistsByUser.playlists.find((el) => el.playlistName === playlistName);
	try {
		if (!allPlaylistsByUser) {
			const newPlaylist = new Playlist({
				userId,
				playlists: [{ playlistName, videos: [videoId] }],
			});
			foundUser.playlists.push(newPlaylist);
			await foundUser.save();
			const newList = await newPlaylist.save();
			return res.status(201).json({ message: "VIdeo added to playlist", playlists: newList });
		}

		// Add a new playlist object in playlists
		if (allPlaylistsByUser && allPlaylistsByUser.playlists.length >= 0) {
			allPlaylistsByUser.playlists.push({
				playlistName,
				videos: [videoId],
			});
			const newList = await allPlaylistsByUser.save();
			return res.status(200).json({ message: "Video added to playlist", playlists: newList });
		}

		// Add a video to a existing playlist
		if (allPlaylistsByUser && foundPlaylist) {
			allPlaylistsByUser.playlists = foundPlaylist.videos.push(videoId);
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
		console.log("allPlaylistsByUser", allPlaylistsByUser);
		allPlaylistsByUser.playlists.map((el) =>
			String(el._id) === String(playlistId) ? el.videos.push(videoId) : el
		);
		const newList = await allPlaylistsByUser.save();
		return res.json({ message: "Video added to playlist", playlists: newList });
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
		console.log("allPlaylistsByUser", allPlaylistsByUser);
		allPlaylistsByUser.playlists.map((el) =>
			String(el._id) === String(playlistId) ? (el.playlistName = newPlaylistName) : el
		);
		const newList = await allPlaylistsByUser.save();
		return res.json({ message: "Changed playlist name", playlists: newList });
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
		console.log("allPlaylistsByUser", allPlaylistsByUser);
		const newList = await allPlaylistsByUser.save();
		return res.json({ message: "Playlist deleted", playlists: newList });
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
		console.log("allPlaylistsByUser", allPlaylistsByUser);
		allPlaylistsByUser.playlists.map((el) => {
			if (String(el._id) === String(playlistId)) {
				return (el.videos = el.videos.filter((video) => String(video) !== String(videoId)));
			}
			return el;
		});
		const newList = await allPlaylistsByUser.save();
		return res.json({ message: "Video deleted from playlist", playlists: newList });
	} catch (error) {
		console.error(error);
		res.status(400).json({
			message: "An error occurred",
		});
	}
});

module.exports = router;
