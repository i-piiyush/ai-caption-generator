const express = require("express");
const router = express.Router();
const {
  registerController,
  loginController,
  userController,
  logoutController
} = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware")
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/register",upload.single("pfp"), registerController);
router.post("/login", loginController);
router.get("/user",authMiddleware,userController)
router.post("/logout",logoutController)

module.exports = router;
