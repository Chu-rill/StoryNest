const UserRepository = require("../repository/user.repository");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class UserService {
  constructor() {
    this.userRepository = UserRepository;
  }

  async registerUser(username, password) {
    try {
      // Validate input
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      // Check if user already exists
      const existingUser = await this.userRepository.findUserByUsername(
        username
      );
      if (existingUser) {
        throw new Error("Username already exists");
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await this.userRepository.createUser({
        username,
        password: hashedPassword,
      });
      return {
        status: "success",
        statusCode: 201,
        message: "User registered successfully",
        user: {
          id: user._id,
          username: user.username,
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async loginUser(username, password) {
    try {
      if (!username || !password) {
        throw new Error("Username and password are required");
      }

      const user = await this.userRepository.findUserByUsername(username);
      if (!user) {
        throw new Error("Invalid credentials");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid credentials");
      }

      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "7d" } // Adding token expiration
      );

      return {
        status: "success",
        statusCode: 200,
        message: "Login successful",
        user: user,
        token: token,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async followUser(userId, followId) {
    try {
      // Validate IDs
      if (!userId || !followId) {
        throw new Error("User IDs are required");
      }

      // Check if trying to follow self
      if (userId === followId) {
        throw new Error("You cannot follow yourself");
      }

      // Check if target user exists
      const targetUser = await this.userRepository.findUserById(followId);
      if (!targetUser) {
        throw new Error("User to follow not found");
      }

      const follow = await this.userRepository.followUser(userId, followId);
      return {
        status: "success",
        statusCode: 200,
        message: "User followed successfully",
        follow: follow,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async unfollowUser(userId, unfollowId) {
    try {
      // Validate IDs
      if (!userId || !unfollowId) {
        throw new Error("User IDs are required");
      }

      // Check if trying to unfollow self
      if (userId === unfollowId) {
        throw new Error("You cannot unfollow yourself");
      }

      // Check if target user exists
      const targetUser = await this.userRepository.findUserById(unfollowId);
      if (!targetUser) {
        throw new Error("User to unfollow not found");
      }

      const unfollow = await this.userRepository.unfollowUser(
        userId,
        unfollowId
      );
      return {
        status: "success",
        statusCode: 200,
        message: "User unfollowed successfully",
        follow: unfollow,
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async getUserProfile(userId) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      const profile = await this.userRepository.getUserProfile(userId);
      if (!profile) {
        throw new Error("User not found");
      }

      return {
        status: "success",
        statusCode: 200,
        message: "User profile retrieved successfully",
        profile: {
          id: profile._id,
          username: profile.username,
          followers: profile.followers,
          following: profile.following,
          bio: profile.bio,
          createdAt: profile.createdAt,
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async updateUserProfile(userId, updateData) {
    try {
      if (!userId) {
        throw new Error("User ID is required");
      }

      if (!updateData || Object.keys(updateData).length === 0) {
        throw new Error("No update data provided");
      }

      // Handle password updates separately
      if (updateData.password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(updateData.password, salt);
      }

      const updatedUser = await this.userRepository.updateUser(
        userId,
        updateData
      );
      if (!updatedUser) {
        throw new Error("User not found");
      }

      return {
        status: "success",
        statusCode: 200,
        message: "User profile updated successfully",
        user: {
          id: updatedUser._id,
          username: updatedUser.username,
          followers: updatedUser.followers,
          following: updatedUser.following,
          bio: updatedUser.bio,
          createdAt: updatedUser.createdAt,
        },
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }
}

module.exports = new UserService();
