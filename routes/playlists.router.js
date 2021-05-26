const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const {
	postVideoToPlaylist,
	addVideoToExistingPlaylist,
	editPlaylistName,
	deletePlaylist,
	deleteVideoFromPlaylist,
} = require("../controllers/playlists.controller");
const { UserIdParamHandler } = require("../middlewares/paramHandler");

// Post a video to playlist
router.param("userId", UserIdParamHandler);
router.route("/:userId/playlists").all(checkAuth).post(postVideoToPlaylist);

// Add a video to an existing playlist
router.route("/:userId/playlists/:playlistId").all(checkAuth).put(addVideoToExistingPlaylist);

//Edit playlist name
router.route("/:userId/playlists/:playlistId/edit-name").all(checkAuth).put(editPlaylistName);

// Delete a playlist
router.route("/:userId/playlists/:playlistId/delete").all(checkAuth).put(deletePlaylist);

// Delete a video from a playlist
router
	.route("/:userId/playlists/:playlistId/:videoId/delete")
	.all(checkAuth)
	.put(deleteVideoFromPlaylist);

module.exports = router;
