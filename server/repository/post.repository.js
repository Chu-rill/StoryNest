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

  async getAllPosts(limit) {
    return await Post.find()
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", ["username"]);
  }

  async updatePost(id, updateData, userId) {
    const post = await Post.findById(id);

    // Check if post exists
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      throw new Error("Unauthorized - only the author can update this post");
    }

    return await Post.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async deletePost(id, userId) {
    const post = await Post.findById(id);

    // Check if post exists
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if user is the author
    if (post.author.toString() !== userId.toString()) {
      throw new Error("Unauthorized - only the author can delete this post");
    }

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

  async addComment(postId, userId, comment) {
    const comment = {
      text: comment,
      author: userId,
      createdAt: new Date(),
    };

    return await Post.findByIdAndUpdate(
      postId,
      { $push: { comments: comment } },
      { new: true }
    ).populate("comments.author", ["username"]);
  }

  async getAllComments(postId) {
    const post = await Post.findById(postId)
      .populate("comments.author", ["username"])
      .select("comments");

    if (!post) {
      throw new Error("Post not found");
    }

    return post.comments;
  }

  async deleteComment(postId, commentId, userId) {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }

    // Find the comment
    const comment = post.comments.id(commentId);

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Check if user is the comment author
    if (comment.author.toString() !== userId.toString()) {
      throw new Error(
        "Unauthorized - only the comment author can delete this comment"
      );
    }

    return await Post.findByIdAndUpdate(
      postId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    ).populate("comments.author", ["username"]);
  }

  async searchPosts(query) {
    return await Post.find(
      { $text: { $search: query } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .populate("author", ["username"]);
  }

  async getUserPosts(userId, limit) {
    return await Post.find({ author: userId })
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate("author", ["username"])
      .populate("comments.author", ["username"]);
  }
}

module.exports = new PostRepository();
