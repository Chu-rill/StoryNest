const PostRepository = require("../repository/post.repository");
const { NotFoundError } = require("../utils/errors");

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
        throw new NotFoundError("Post not found");
      }
      return {
        status: "success",
        message: "Post retrieved successfully",
        statusCode: 200,
        post: {
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
          category: post.category,
          author: post.author,
          likes: post.likes,
          tags: post.tags,
          comment: post.comments,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
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

  async getAllPosts(query) {
    try {
      const result = await this.postRepository.getAllPosts(query);
      if (!result || result.posts.length === 0) {
        throw new NotFoundError("No posts found");
      }
      if (query.page < 1) {
        throw new Error("Page number must be greater than 0");
      }
      return {
        status: "success",
        statusCode: 200,
        message: "Posts retrieved successfully",
        posts: result.posts.map((post) => ({
          id: post._id,
          title: post.title,
          summary: post.summary,
          content: post.content,
          image: post.image,
          author: post.author
            ? {
                id: post.author._id,
                username: post.author.username,
              }
            : null,
          category: post.category,
          tags: post.tags || [],
          likes: post.likes ? post.likes.length : 0,
          commentsCount: post.comments ? post.comments.length : 0,
          createdAt: post.createdAt,
          updatedAt: post.updatedAt,
        })),
        pagination: {
          total: result.total,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          limit: query.limit || 10,
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

  async getPostsByUserId(userId, limit) {
    try {
      const posts = await this.postRepository.getUserPosts(userId, limit);

      if (!posts || posts.length === 0) {
        throw new NotFoundError("No posts found for this user");
      }

      return {
        status: "success",
        message: "Posts retrieved successfully",
        statusCode: 200,
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
        userId,
        comment
      );
      console.log(newComment);
      return {
        status: "success",
        statusCode: 200,
        message: "Comment added successfully",
        comment: {
          id: newComment.id,
          text: newComment.text,
          author: {
            id: newComment.author.id,
            username: newComment.author.username,
          },
          createdAt: newComment.createdAt,
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
        statusCode: 200,
        comments: comments.map((comment) => ({
          id: comment.id,
          text: comment.text,
          author: {
            id: comment.author?.id,
            username: comment.author?.username,
          },
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt,
          likes: comment.likes ? comment.likes.length : 0,
          likedBy: comment.likes
            ? comment.likes.map((like) => ({
                id: like.id,
                username: like.username,
              }))
            : [],
        })),
      };
    } catch (error) {
      return {
        status: "error",
        message: error.message,
        statusCode: error.message.includes("Post not found") ? 404 : 400,
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
        statusCode: 200,
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

  async sharePost(postId, userId) {
    if (!userId) {
      throw new Error("User ID is required for sharing a post");
    }

    if (!postId) {
      throw new Error("Post ID is required");
    }

    try {
      const post = await this.postRepository.findPostById(postId);
      if (!post) {
        throw new NotFoundError("Post not found");
      }

      // Check if user has already shared this post
      const existingShare = this._findExistingShare(post.shares, userId);

      let isNewShare = false;
      if (!existingShare) {
        // Add the share record - Fixed: use 'user' instead of 'userId'
        post.shares.push({
          user: userId, // ✅ Changed from 'userId' to 'user'
          sharedAt: new Date(),
        });

        // Increment share count
        post.shareCount = (post.shareCount || 0) + 1;

        // Save the updated post
        await this.postRepository.updatePostShare(postId, userId);
        isNewShare = true;
      }

      // Populate the post with author details
      await this.postRepository.populatePostAuthor(post);

      return {
        status: "success",
        statusCode: 200,
        post,
        isNewShare,
        message: isNewShare
          ? "Post shared successfully"
          : "Post already shared",
      };
    } catch (error) {
      console.error("Error in sharePost:", error); // Added logging
      return {
        status: "error",
        statusCode: error.message.includes("Post not found") ? 404 : 400,
        message: error.message,
      };
    }
  }

  _findExistingShare(shares, userId) {
    return shares.find(
      (share) =>
        share.user?.toString() === userId || // ✅ Changed from 'userId' to 'user'
        share.toString() === userId
    );
  }
}

module.exports = new PostService();
