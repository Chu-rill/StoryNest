const UserService = require("../service/user.service");
const emailService = require("../utils/email");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await UserService.loginUser(username, password);

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
      })
      .status(user.statusCode)
      .json(user);
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
    const { username, password, email } = req.body;
    const user = await UserService.registerUser(username, password, email);
    const data = {
      subject: "Welcome to Express Template",
      username: username,
    };
    await emailService.sendEmailWithTemplate(email, data);
    res.status(user.statusCode).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.profile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profile = await UserService.getUserProfile(userId);
    res.status(profile.statusCode).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.followUser = async (req, res) => {
  try {
    const followerUserId = req.user.id;
    const followingUserId = req.params.id;

    const user = await UserService.followUser(followerUserId, followingUserId);

    res.status(user.statusCode).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const followerUserId = req.user.id;
    const unfollowingUserId = req.params.id;

    const user = await UserService.unfollowUser(
      followerUserId,
      unfollowingUserId
    );

    res.status(user.statusCode).json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id;
    const profile = await UserService.getUserProfile(userId);

    res.status(profile.statusCode).json(profile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { username, password, email, bio, profilePicture } = req.body;
    const updateData = {
      username,
      password,
      email,
      bio,
      profilePicture,
    };

    const updatedProfile = await UserService.updateUserProfile(
      userId,
      updateData
    );

    res.status(updatedProfile.statusCode).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
