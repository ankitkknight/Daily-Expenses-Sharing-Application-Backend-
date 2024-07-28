const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/createuser", userController.createUser);
router.get("/:id", userController.getUser);
router.post("/login", userController.loginUser);
router.post("/logout", userController.logoutUser);

module.exports = router;
