const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		video: { type: Schema.Types.ObjectId },
		notes: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Note", notesSchema);
