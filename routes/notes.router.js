const express = require("express");
const checkAuth = require("../middlewares/checkAuth");
const router = express.Router();
const { getNotesForVideo, addOrEditNotes, deleteNote } = require("../controllers/notes.controller");

// Get note for a particular video
router.route("/:userId/:videoId/get-notes").all(checkAuth).get(getNotesForVideo);

// Add/Edit a note
router.route("/:userId/:videoId/add-notes").all(checkAuth).post(addOrEditNotes);

//Delete a note
router.route("/").all(checkAuth).delete(deleteNote);

module.exports = router;
