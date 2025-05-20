const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv").config();

// Route imports
const authRoutes = require("./routes/auth.routes");
const postRoutes = require("./routes/post.routes");

// Initialize express
const app = express();

// Configuration
const PORT = process.env.PORT || 3001;
const MONGODB_URL = process.env.MONGODB_URL || "mongodb://localhost:27017/blog";
const ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "https://nspire-xrhy.vercel.app",
];

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ALLOWED_ORIGINS,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Static files
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Global timeout middleware
app.use((req, res, next) => {
  res.setTimeout(120000, () => {
    res.status(408).json({ error: "Request timeout" });
  });
  next();
});

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use("/auth", authRoutes);
app.use("/content", postRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something broke!",
    message:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Database connection
mongoose
  .connect(MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("📦 Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  });

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

module.exports = app;
