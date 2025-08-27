const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/auth.route");
const postsRoutes = require("./routes/posts.route");
const healthRoute = require("./routes/health.route");
const cors = require("cors");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: [
      "http://localhost:5173", // local React dev server
      "https://ai-caption-generator-gules.vercel.app" // deployed frontend
    ],
    credentials: true,
  })
);
app.use("/auth", authRoutes);
app.use("/posts", postsRoutes);
app.use("/health", healthRoute);

module.exports = app;
