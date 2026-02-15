const UserService = require("../service/user.service");
const { sendEmailWithTemplate } = require("../utils/email");
const jwt = require("jsonwebtoken");
const passport = require("passport");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserService.loginUser(email, password);

    res.status(user.statusCode).json(user);
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
      subject: "Welcome to StoryNest",
      username: username,
    };
    await sendEmailWithTemplate(email, data);
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

exports.users = async (req, res) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(users.statusCode).json(users);
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
    const {
      username,
      password,
      email,
      bio,
      profilePicture,
      profileBackground,
    } = req.body;
    const updateData = {
      username,
      password,
      email,
      bio,
      profilePicture,
      profileBackground,
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

// Google OAuth
exports.googleAuth = passport.authenticate("google", {
  scope: ["profile", "email"],
});

exports.googleAuthCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user, info) => {
    if (err) {
      console.error("Google auth error:", err);
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=authentication_failed`
      );
    }

    if (!user) {
      return res.redirect(
        `${process.env.CLIENT_URL}/login?error=no_user_found`
      );
    }

    try {
      // Generate JWT token
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "4h" }
      );

      // Redirect to client with token
      res.redirect(
        `${process.env.CLIENT_URL}/auth/callback?token=${token}&user=${encodeURIComponent(
          JSON.stringify({
            id: user._id,
            username: user.username,
            email: user.email,
            profilePicture: user.profilePicture,
            bio: user.bio,
            followers: user.followers,
            following: user.following,
          })
        )}`
      );
    } catch (error) {
      console.error("Token generation error:", error);
      res.redirect(
        `${process.env.CLIENT_URL}/login?error=token_generation_failed`
      );
    }
  })(req, res, next);
};
