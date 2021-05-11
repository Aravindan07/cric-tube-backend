const express = require("express");
const router = express.Router();
const User = require("../models/user.model");

router.post("/signup", async (req, res) => {
	const { email, password } = req.body;
	if (email === "" && password === "") {
		return res.status(400).json({ message: "Invalid Credentials" });
	}
	const user = await User.findOne({ email: email });
	if (user) {
		return res.status(400).json({ message: "This user already exists" });
	}
	const newUser = new User({ email: email, password: password });
	const savedUser = await newUser.save();
	savedUser.password = undefined;
	savedUser.__v = undefined;
	return res.json({
		message: "Registered successfully!",
		user: savedUser,
	});
});

// router.get()

module.exports = router;
