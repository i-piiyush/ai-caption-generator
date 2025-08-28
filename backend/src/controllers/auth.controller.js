// auth.controller.js

const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs"); // Corrected spelling from 'bcyrpt'
const { v4: uuidv4 } = require("uuid");
const uploadedImage = require("../services/storage.service");

const registerController = async (req, res) => {
  try {
    const { username, password, fullname, bio } = req.body;

    // --- FIX: Handle missing file upload ---
    if (!req.file) {
      return res.status(400).json({ message: "Profile picture is required" });
    }
    const pfp = req.file.buffer;

    const isUserValid = await userModel.findOne({ username });
    if (isUserValid) {
      return res.status(409).json({ message: "User already exists" });
    }

    const uploadedPfp = await uploadedImage(pfp, uuidv4(), "profile_pictures");
    if (!uploadedPfp || !uploadedPfp.url) {
      return res.status(500).json({ message: "Image upload failed" });
    }

    const user = await userModel.create({
      username,
      password: await bcrypt.hash(password, 10), // Corrected variable
      fullname,
      bio,
      pfp: uploadedPfp.url,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    // --- FIX: Consistent and secure cookie settings ---
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    // Avoid sending back sensitive info like the hashed password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({ message: "User created successfully", user: userResponse });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginController = async (req, res) => {
  // --- FIX: Added full try...catch block ---
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const payload = { id: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET);

    // --- FIX: Added required cookie options for deployment ---
    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res.status(200).json({
      message: "User successfully logged in",
      username,
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const userController = async (req, res) => {
  // --- FIX: Added full try...catch block ---
  try {
    // Corrected variable name from 'post' to 'posts' for clarity
    const posts = await postModel.find({ user: req.user._id });
    const { password, ...userData } = req.user.toObject();

    res.status(200).json({
      posts,
      user: userData,
    });
  } catch (err) {
    console.error("User profile fetch error:", err.message);
    res.status(500).json({ message: "Internal server error" });
  }
};

const logoutController = (req, res) => {
  try {
    // --- FIX: Added options to ensure cookie is cleared cross-site ---
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout error:", error.message);
    res.status(500).json({
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  userController,
  logoutController,
};
