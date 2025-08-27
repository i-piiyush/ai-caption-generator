const postModel = require("../models/post.model");
const generateCaption = require("../services/ai.service");
const sharp = require("sharp");
const uploadImage = require("../services/storage.service");
const { v4: uuidv4 } = require("uuid");

// Utility: Convert URL → Base64
async function urlToBase64(imageUrl) {
  const response = await fetch(imageUrl);
  const buffer = Buffer.from(await response.arrayBuffer());
  return buffer.toString("base64");
}

// Create new post
const createPostController = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Compress image
    const compressedImage = await sharp(req.file.buffer)
      .jpeg({ quality: 70 })
      .toBuffer();

    // Convert to base64 once
    const base64Image = compressedImage.toString("base64");

    // Generate caption
    const caption = await generateCaption(base64Image);

    // Upload image (store compressed version, not raw)
    const uploadedImage = await uploadImage(compressedImage, uuidv4(),"posts");
    if (!uploadedImage || !uploadedImage.url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    // Save post
    const post = await postModel.create({
      post: uploadedImage.url,
      user: req.user._id,
      caption, // store initial caption also
    });

    res.status(201).json({
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create Post Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Regenerate caption for an existing post
const generateCaptionController = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await postModel.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Convert stored URL → base64
    const base64Image = await urlToBase64(post.post);

    // Generate new caption
    const caption = await generateCaption(base64Image);

    // Update post
    post.caption = caption;
    await post.save();

    res.json({
      message: "New caption generated",
      post,
    });
  } catch (error) {
    console.error("Regenerate Caption Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createPostController,
  generateCaptionController,
  urlToBase64
};
