const express = require("express");
const router = express.Router();
const { createPostController,generateCaptionController } = require("../controllers/post.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const multer = require("multer");
const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", authMiddleware, upload.single("post"), createPostController);
router.put("/:id/generate-caption",authMiddleware,generateCaptionController)

module.exports = router;
