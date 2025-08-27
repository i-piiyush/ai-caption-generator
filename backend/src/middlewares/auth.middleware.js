const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "unauthorized access",
    });
  }

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decode.id);

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "invalid token",
    });
  }
};

module.exports = authMiddleware;
