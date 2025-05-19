const express = require("express");
const authRoutes = express.Router();
const {
  login,
  signup,
  profile,
  logout,
  followUser,
  unfollowUser,
  getUserProfile,
} = require("../controllers/auth.controller");
const { authenticate } = require("../middleware/jwt");

// Auth routes
authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/signup", signup);

// Protected routes
authRoutes.get("/profile", authenticate, profile);
authRoutes.post("/follow/:id", authenticate, followUser);
authRoutes.post("/unfollow/:id", authenticate, unfollowUser);
authRoutes.get("/user/:id", authenticate, getUserProfile);

module.exports = authRoutes;
