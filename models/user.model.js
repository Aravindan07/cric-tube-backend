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
		watchLater: [
			{
				type: Schema.Types.ObjectId,
				ref: "LikedVideo",
			},
		],
		savedVideos: [
			{
				type: Schema.Types.ObjectId,
				ref: "SavedVideo",
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
