const PostRepository = require('../repository/post.repository');

class PostService {
  constructor() {
    this.postRepository = PostRepository;
  }

  async createPost(postData) {
    return await this.postRepository.createPost(postData);
  }

  async getPostById(id) {
    return await this.postRepository.findPostById(id);
  }

  async getAllPosts(limit) {
    return await this.postRepository.getAllPosts(limit);
  }

  async updatePost(id, updateData) {
    return await this.postRepository.updatePost(id, updateData);
  }

  async deletePost(id) {
    return await this.postRepository.deletePost(id);
  }

  async likePost(postId, userId) {
    return await this.postRepository.likePost(postId, userId);
  }

  async unlikePost(postId, userId) {
    return await this.postRepository.unlikePost(postId, userId);
  }

  async addComment(postId, comment) {
    return await this.postRepository.addComment(postId, comment);
  }

  async searchPosts(query) {
    return await this.postRepository.searchPosts(query);
  }
}

module.exports = new PostService();