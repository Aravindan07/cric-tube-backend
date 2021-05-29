const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();
const {
	getNotesForVideo,
	addOrEditNotes,
	deleteNote,
	editNote,
} = require("../controllers/notes.controller");

// Get note for a particular video
router.route("/:userId/:videoId/get-notes").all(checkAuth).get(getNotesForVideo);

// Add a note
router.route("/:userId/:videoId/add-notes").all(checkAuth).post(addOrEditNotes);

// Edit a note
router.route("/:userId/:videoId/edit-notes").all(checkAuth).put(editNote);

//Delete a note
router.route("/:userId/:videoId/delete-note").all(checkAuth).put(deleteNote);

module.exports = router;
