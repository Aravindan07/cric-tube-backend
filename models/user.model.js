const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
	{
		email: { type: String, required: [true, "Email Id is required"] },
		password: { type: String, required: [true, "Password is required"] },
		playlists: [
			{
				type: Schema.Types.ObjectId,
				ref: "Playlist",
			},
		],
		likedVideos: [
			{
				type: Schema.Types.ObjectId,
				ref: "LikedVideo",
			},
		],
		dislikedVideos: [
			{
				type: Schema.Types.ObjectId,
				ref: "DislikedVideo",
			},
		],
		watchLater: [
			{
				type: Schema.Types.ObjectId,
				ref: "WatchLater",
			},
		],
		savedVideos: [
			{
				type: Schema.Types.ObjectId,
				ref: "SavedVideo",
			},
		],
		history: [
			{
				type: Schema.Types.ObjectId,
				ref: "History",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
