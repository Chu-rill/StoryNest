const express = require("express");
const authRoutes = express.Router();
const {
  login,
  signup,
  profile,
  logout,
} = require("../controllers/authController");

authRoutes.post("/login", login);
authRoutes.post("/logout", logout);
authRoutes.post("/signup", signup);
authRoutes.get("/profile", profile);

module.exports = authRoutes;
