const Category = require("../models/category.model");

const getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({}).populate("videos").select("-__v");
		res.status(200).json({ categories });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Some error occurred while fetching!" });
	}
};

const getCategoryById = async (req, res) => {
	const { categoryId } = req.params;
	try {
		const categoryById = await Category.findById({ _id: categoryId })
			.populate("videos")
			.select("-__v")
			.exec();
		res.status(200).json({ data: categoryById });
	} catch (error) {
		next(error);
	}
};

const postCategory = async (req, res) => {
	const category = req.body;
	const newCategory = new Category(category);
	try {
		const saveCategory = await newCategory.save();
		res.status(201).json({ category: saveCategory });
	} catch (error) {
		console.error(error);
		res.status(400).json({ message: "Validation Failed" });
	}
};

module.exports = { getAllCategories, getCategoryById, postCategory };
