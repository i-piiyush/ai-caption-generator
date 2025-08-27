const userModel = require("../models/user.model");
const postModel = require("../models/post.model");
const jwt = require("jsonwebtoken");
const bcyrpt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");
const uploadedImage = require("../services/storage.service");

const registerController = async (req, res) => {
  try {
    const { username, password, fullname, bio } = req.body;
    const pfp = req.file.buffer;

    const isUserValid = await userModel.findOne({ username });
    if (isUserValid) {
      return res.status(409).json({ message: "user already exists" });
    }

    const uploadedPfp = await uploadedImage(pfp, uuidv4(), "profile_pictures");

    if (!uploadedPfp || !uploadedPfp.fileId) {
      return res.status(500).json({ message: "image upload failed" });
    }

    const user = await userModel.create({
      username,
      password: await bcyrpt.hash(password, 10),
      fullname,
      bio,
      pfp: uploadedPfp.url, // ✅ sirf URL save kar
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.cookie("token", token, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true, // JS cannot access cookie → prevents XSS
      secure: true, // only sent over HTTPS (must be HTTPS in prod!)
      sameSite: "none", // allows cross-site requests (needed if frontend + backend are on different domains)
    });

    res.status(201).json({ message: "user created successfully", user });
  } catch (err) {
    console.error("Register error:", err.message);
    res.status(500).json({ message: "internal server error" });
  }
};

const loginController = async (req, res) => {
  const { username, password } = req.body;
  const user = await userModel.findOne({
    username: username,
  });

  if (!user) {
    return res.status(404).json({
      message: "user not found",
    });
  }

  const payload = {
    id: user._id,
  };

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: "invalid password" });
  }

  const token = jwt.sign(payload, process.env.JWT_SECRET);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // local dev me false
    sameSite: "none",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });
  return res.status(200).json({
    message: "user succefully logged in",
    username,
  });
};
const userController = async (req, res) => {
  const post = await postModel.find({ user: req.user._id });
  const { password, ...userData } = req.user.toObject();

  res.json({
    post,
    user: userData,
  });
};
const logoutController = (req, res) => {
  try {
    res.clearCookie("token");

    res.status(200).json({
      message: "logout successfull",
    });
  } catch (error) {
    res.json({
      message: error,
    });
  }
};

module.exports = {
  registerController,
  loginController,
  userController,
  logoutController,
};
