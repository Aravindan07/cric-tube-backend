const mongoose = require("mongoose");
const Schema = mongoose.Schema;
require("mongoose-type-url");

const videoSchema = new Schema({
	videoId: { type: String, required: true },
	name: { type: String, required: true },
	imageUrl: { type: mongoose.SchemaTypes.Url, required: true },
	description: { type: String, required: true },
	thumbnail: { type: mongoose.SchemaTypes.Url, required: true },
	views: { type: Number, required: true, default: 0 },
	watchLength: { type: String, required: true },
	publishedDate: { type: String, required: true },
	channel: { type: String, required: true },
	category: { type: Schema.Types.ObjectId, ref: "Category" },
});

module.exports = mongoose.model("Video", videoSchema);
