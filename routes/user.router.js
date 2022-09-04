const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { userRegister, userLogin, loadUser } = require("../controllers/user.controller");

// Signup
router.route("/signup").post(userRegister);

// Login
router.route("/login").post(userLogin);

// load User
router.route("/").all(checkAuth).get(loadUser);

module.exports = router;
