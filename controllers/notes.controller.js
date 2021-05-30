const Note = require("../models/notes.model");

const getNotesForVideo = async (req, res) => {
	const { userId, videoId } = req.params;
	try {
		const foundNote = await Note.findOne({ userId });
		const foundVideoNote = foundNote.notes.find((el) => String(el.videoId) === String(videoId));
		if (foundVideoNote) {
			return res.status(200).json({ item: foundVideoNote });
		}
		return res.status(404).json({ message: "You didn't added notes for this video" });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "An error occurred while fetching data" });
	}
};

const addOrEditNotes = async (req, res) => {
	const { userId, videoId, notes } = req.body;
	let foundNotes = await Note.findOne({ userId });

	try {
		if (foundNotes) {
			// adding notes for newVideo
			foundNotes.notes.push({ videoId, note: notes });
			const newNote = await foundNotes.save();
			return res.status(200).json({ message: "Added notes for this video!", item: newNote });
		}
		// Adding note for the first time
		const newNote = new Note({ userId, notes: [{ videoId, note: notes }] });
		const addedNote = await newNote.save();
		return res.status(201).json({ message: "Added notes for this video", item: addedNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while doing this operation" });
	}
};

const editNote = async (req, res) => {
	const { userId, noteId, newNote } = req.body;
	try {
		const foundNote = await Note.findOne({ userId });
		foundNote.notes.map((el) => (String(el._id) === String(noteId) ? (el.note = newNote) : el));
		const updatedNote = await foundNote.save();
		return res.json({ message: "Updated notes for this video", item: updatedNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while doing this operation" });
	}
};

const deleteNote = async (req, res) => {
	const { userId, videoId } = req.body;
	try {
		let foundNote = await Note.findOne({ userId });
		foundNote.notes = foundNote.notes.filter((el) => String(el.videoId) !== String(videoId));
		const newNote = await foundNote.save();
		return res.status(200).json({ message: "Note deleted", item: newNote });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "An error occurred while doing this operation" });
	}
};

module.exports = { getNotesForVideo, addOrEditNotes, editNote, deleteNote };
