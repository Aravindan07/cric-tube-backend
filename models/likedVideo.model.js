const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const likedVideoSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		videos: [{ type: Schema.Types.ObjectId, ref: "Video" }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("LikedVideo", likedVideoSchema);
