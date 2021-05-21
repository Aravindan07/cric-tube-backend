const express = require("express");
const router = express.Router();
const User = require("../models/user.model");
const checkAuth = require("../middlewares/checkAuth");
const { userRegister, userLogin } = require("../controllers/user.controller");

router.route("/signup").post(userRegister);

router.route("/login").post(userLogin);

// Load user data
router.get("/", checkAuth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id)
			.select("-password -createdAt -updatedAt -__v")
			.populate({
				path: "likedVideos",
				model: "LikedVideo",
				populate: { path: "videos", model: "Video" },
			})
			.populate({
				path: "dislikedVideos",
				model: "DislikedVideo",
				populate: { path: "videos", model: "Video" },
			})
			.populate({
				path: "watchLater",
				model: "WatchLater",
				populate: { path: "videos", model: "Video" },
			})
			.populate({
				path: "savedVideos",
				model: "SavedVideo",
				populate: { path: "videos", model: "Video" },
			})
			.populate({
				path: "playlists",
				model: "Playlist",
				populate: { path: "playlists.videos", model: "Video" },
			});
		return res.status(200).json({
			user,
		});
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred" });
	}
});

module.exports = router;
