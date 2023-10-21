const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.get("/getAllUsers", userController.getAllUsers);
router.post("/addUser", userController.addUser);
router.post("/deleteUser", userController.deleteUser);

module.exports = router;
