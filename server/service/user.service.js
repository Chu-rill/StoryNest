const UserRepository = require('../repository/user.repository');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

class UserService {
  constructor() {
    this.userRepository = UserRepository;
  }

  async registerUser(userData) {
    const { username, password } = userData;
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    return await this.userRepository.createUser({
      username,
      password: hashedPassword
    });
  }

  async loginUser(username, password) {
    const user = await this.userRepository.findUserByUsername(username);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET
    );

    return { user, token };
  }

  async followUser(userId, followId) {
    return await this.userRepository.followUser(userId, followId);
  }

  async unfollowUser(userId, unfollowId) {
    return await this.userRepository.unfollowUser(userId, unfollowId);
  }

  async getUserProfile(userId) {
    return await this.userRepository.getUserProfile(userId);
  }

  async updateUserProfile(userId, updateData) {
    return await this.userRepository.updateUser(userId, updateData);
  }
}

module.exports = new UserService();
