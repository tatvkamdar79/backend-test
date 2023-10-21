const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.login);
router.get("/test", (req, res) => res.json({}));

module.exports = router;
