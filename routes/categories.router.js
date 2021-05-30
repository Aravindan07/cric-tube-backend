const express = require("express");
const {
	getAllCategories,
	getCategoryById,
	postCategory,
} = require("../controllers/categories.controller");
const router = express.Router();

//Get all categories
router.route("/").get(getAllCategories).post(postCategory);

// Get category By Id
router.route("/:categoryId").get(getCategoryById);

module.exports = router;
