const User = require("../model/user.model");

class UserRepository {
  async createUser(userData) {
    return await User.create(userData);
  }

  async findUserById(id) {
    return await User.findById(id);
  }

  async findAllUsers() {
    return await User.find().select("-password");
  }

  async findUserByEmail(email) {
    return await User.findOne({ email });
  }

  async updateUser(id, updateData) {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
  }

  async followUser(userId, followId) {
    const user = await User.findById(userId);
    const followUser = await User.findById(followId);

    if (!user.following.includes(followId)) {
      await user.updateOne({ $push: { following: followId } });
      await followUser.updateOne({ $push: { followers: userId } });
    }
    return user;
  }

  async unfollowUser(userId, unfollowId) {
    const user = await User.findById(userId);
    const unfollowUser = await User.findById(unfollowId);

    if (user.following.includes(unfollowId)) {
      await user.updateOne({ $pull: { following: unfollowId } });
      await unfollowUser.updateOne({ $pull: { followers: userId } });
    }
    return user;
  }

  async getUserProfile(userId) {
    return await User.findById(userId)
      .select("-password")
      .populate({
        path: "followers",
        select: "username profilePicture bio",
      })
      .populate({
        path: "following",
        select: "username profilePicture bio",
      });
  }
}

module.exports = new UserRepository();
