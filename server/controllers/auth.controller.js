const UserService = require('../service/user.service');
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { user, token } = await UserService.loginUser(username, password);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    }).json({ 
      id: user._id, 
      username: user.username 
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.logout = async (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
};
exports.signup = async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(201).json({ id: user._id, username: user.username });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
exports.profile = async (req, res) => {
  try {
    const profile = await UserService.getUserProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
