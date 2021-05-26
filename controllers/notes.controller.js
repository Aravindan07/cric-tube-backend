const Note = require("../models/notes.model");

const getNotesForVideo = async (req, res) => {
	const { userId, videoId } = req.params;
	try {
		const foundNote = await Note.findOne({ userId, video: videoId });
		return res.status(200).json({ notes: foundNote });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred while fetching data" });
	}
};

const addOrEditNotes = async (req, res) => {
	const { userId, videoId, notes } = req.body;
	try {
		const foundNotes = await Note.findOne({ userId, video: videoId });
		let savedNote = null;
		if (foundNotes) {
			foundNotes.notes = notes;
			savedNote = await foundNotes.save();
			return res.status(201).json({ message: "Notes Updated", savedNote });
		}
		const newNote = new Note({ userId, video: videoId, notes });
		savedNote = await newNote.save();
		res.status(201).json({ message: "Added notes", savedNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while doing this operation" });
	}
};

const deleteNote = async (req, res) => {
	const { userId, videoId } = req.params;
	try {
		const foundNote = await Note.findOne({ userId, video: videoId });
		foundNote.remove();
		res.status(200).json({ message: "Note deleted", deletedNote: foundNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while doing this operation" });
	}
};

module.exports = { getNotesForVideo, addOrEditNotes, deleteNote };
