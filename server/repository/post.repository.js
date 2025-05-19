const Post = require("../model/post.model");

class PostRepository {
  async createPost(postData) {
    return await Post.create(postData);
  }

  async findPostById(id) {
    return await Post.findById(id)
      .populate("author", ["username"])
      .populate("comments.author", ["username"]);
  }

  async getAllPosts(limit = 20) {
    return await Post.find()
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", ["username"]);
  }

  async updatePost(id, updateData) {
    return await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deletePost(id) {
    return await Post.findByIdAndDelete(id);
  }

  async likePost(postId, userId) {
    const post = await Post.findById(postId);
    if (!post.likes.includes(userId)) {
      await post.updateOne({ $push: { likes: userId } });
    }
    return post;
  }

  async unlikePost(postId, userId) {
    const post = await Post.findById(postId);
    if (post.likes.includes(userId)) {
      await post.updateOne({ $pull: { likes: userId } });
    }
    return post;
  }

  async addComment(postId, comment) {
    return await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate("comments.author", ["username"]);
  }

  async deleteComment(postId, commentId) {
    return await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );
  }

  async searchPosts(query) {
    return await Post.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("author", ["username"]);
  }
}

module.exports = new PostRepository();
