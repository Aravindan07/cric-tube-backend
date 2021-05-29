const express = require("express");
const router = express.Router();
const checkAuth = require("../middlewares/checkAuth");
const { historyController } = require("../controllers/history.controller");
const { UserIdParamHandler } = require("../middlewares/paramHandler");

router.param("userId", UserIdParamHandler);
router.route("/:userId/add-to-history").all(checkAuth).post(historyController);

module.exports = router;
