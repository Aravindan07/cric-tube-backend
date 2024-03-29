const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const playlistSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		playlists: [
			{
				playlistName: { type: String, required: true },
				videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
			},
		],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Playlist", playlistSchema);
