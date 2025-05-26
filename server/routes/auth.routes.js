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
  updateUserProfile,
  users,
  getAllUsers,
} = require("../controllers/auth.controller");
const { protect } = require("../middleware/jwt");
const validator = require("../middleware/validation");
const userValidation = require("../validation/user.validation");

// Auth routes
authRoutes.post(
  "/login",
  validator.validateSchema(userValidation.login),
  login
);
authRoutes.post("/logout", logout);
authRoutes.post(
  "/signup",
  validator.validateSchema(userValidation.register),
  signup
);

// Protected routes
authRoutes.get("/profile", protect, profile);
authRoutes.get("/users", protect, users);
authRoutes.post("/follow/:id", protect, followUser);
authRoutes.post("/unfollow/:id", protect, unfollowUser);
authRoutes.put(
  "/update",
  validator.validateSchema(userValidation.update),
  protect,
  updateUserProfile
);
authRoutes.get("/user/:id", protect, getUserProfile);

module.exports = authRoutes;
