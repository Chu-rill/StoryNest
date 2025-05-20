const PostRepository = require("../repository/post.repository");

class PostService {
  constructor() {
    this.postRepository = PostRepository;
  }

  async createPost(postData) {
    try {
      const post = await this.postRepository.createPost(postData);
      return {
        status: "success",
        statusCode: 201,
        message: "Post created successfully",
        post: {
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: 400,
        message: error.message,
      };
    }
  }

  async getPostById(id) {
    try {
      const post = await this.postRepository.findPostById(id);
      if (!post) {
        // throw new Error("Post not found");
        return {
          status: "error",
          statusCode: 404,
          message: "Post not found",
        };
      }
      return {
        status: "success",
        message: "Post retrieved successfully",
        post: {
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: 404,
        message: "Post not found",
      };
    }
  }

  async getAllPosts(limit) {
    try {
      const post = await this.postRepository.getAllPosts(limit);
      return {
        status: "success",
        message: "Posts retrieved successfully",
        posts: post.map((post) => ({
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        })),
        totalPosts: post.length,
        totalPages: Math.ceil(post.length / limit),
        currentPage: 1,
        limit: limit,
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  async getPostsByUserId(userId, limit) {
    try {
      const posts = await this.postRepository.getUserPosts(userId, limit);
      return {
        status: "success",
        message: "Posts retrieved successfully",
        posts: posts.map((post) => ({
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        })),
        totalPosts: posts.length,
        totalPages: Math.ceil(posts.length / 20),
        currentPage: 1,
        limit: 20,
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  async updatePost(id, updateData) {
    try {
      const post = await this.postRepository.updatePost(
        id,
        updateData,
        updateData.author
      );
      return {
        status: "success",
        statusCode: 200,
        message: "Post updated successfully",
        post: {
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Unauthorized") ? 403 : 400,
        message: error.message,
      };
    }
  }

  async deletePost(id, userId) {
    try {
      await this.postRepository.deletePost(id, userId);
      return {
        status: "success",
        statusCode: 200,
        message: "Post deleted successfully",
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Unauthorized") ? 403 : 400,
        message: error.message,
      };
    }
  }

  async likePost(postId, userId) {
    try {
      const post = await this.postRepository.likePost(postId, userId);
      return {
        status: "success",
        statusCode: 200,
        message: "Post liked successfully",
        post: {
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  async unlikePost(postId, userId) {
    try {
      const post = await this.postRepository.unlikePost(postId, userId);
      return {
        status: "success",
        statusCode: 200,
        message: "Post unliked successfully",
        post: {
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  async addComment(postId, comment, userId) {
    try {
      const newComment = await this.postRepository.addComment(
        postId,
        comment,
        userId
      );
      return {
        status: "success",
        statusCode: 200,
        message: "Comment added successfully",
        comment: {
          id: newComment._id,
          content: newComment.content,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  async getAllComments(postId) {
    try {
      // Validate postId
      if (!postId) {
        throw new Error("Post ID is required");
      }

      // Check if post exists
      const post = await this.postRepository.findPostById(postId);
      if (!post) {
        throw new Error("Post not found");
      }

      const comments = await this.postRepository.getAllComments(postId);

      return {
        status: "success",
        message: "Comments retrieved successfully",
        comments: comments.map((comment) => ({
          id: comment._id,
          content: comment.content,
          user: {
            id: comment.user._id,
            username: comment.user.username,
          },
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          likes: comment.likes ? comment.likes.length : 0,
          likedBy: comment.likes
            ? comment.likes.map((like) => ({
                id: like._id,
                username: like.username,
              }))
            : [],
        })),
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
      };
    }
  }

  async deleteComment(postId, commentId, userId) {
    try {
      const comment = await this.postRepository.deleteComment(
        postId,
        commentId,
        userId
      );
      return {
        status: "success",
        statusCode: 200,
        message: "Comment deleted successfully",
        comment: {
          id: comment._id,
          content: comment.content,
        },
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  async searchPosts(query) {
    try {
      const post = await this.postRepository.searchPosts(query);
      return {
        status: "success",
        message: "Posts retrieved successfully",
        posts: post.map((post) => ({
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
        })),
        totalPosts: post.length,
        totalPages: Math.ceil(post.length / 20),
        currentPage: 1,
        limit: 20,
      };
    } catch (error) {
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }
}

module.exports = new PostService();
