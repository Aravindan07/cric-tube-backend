const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notesSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: "User" },
		notes: [{ videoId: { type: Schema.Types.ObjectId }, note: String }],
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Note", notesSchema);
