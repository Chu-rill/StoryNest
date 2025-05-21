const PostService = require("../service/post.service");

exports.post = async (req, res) => {
  try {
    const { title, summary, content, image } = req.body;
    const userId = req.user.id;
    const postData = {
      title: title,
      summary: summary,
      content: content,
      // image: req.file.path,
      image: image,
      author: userId,
    };

    const post = await PostService.createPost(postData);
    res.status(post.statusCode).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const query = {
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 10,
      category: req.query.category,
      tag: req.query.tag,
    };

    const posts = await PostService.getAllPosts(query);
    res.status(posts.statusCode).json(posts);
  } catch (error) {
    res.status(400).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.userId;
    const limit = req.query.limit || 20;
    const posts = await PostService.getPostsByUserId(userId, limit);
    res.status(posts.statusCode).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.viewPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostService.getPostById(id);
    res.status(post.statusCode).json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.editPost = async (req, res) => {
  try {
    const { title, summary, content, image } = req.body;
    const userId = req.user.id;
    const postId = req.params.id;
    const updateData = {
      title: title,
      summary: summary,
      content: content,
      image: image,
      author: userId, // from auth middleware
    };

    const result = await PostService.updatePost(postId, updateData);

    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await PostService.deletePost(postId, userId);

    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await PostService.likePost(postId, userId);

    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await PostService.unlikePost(postId, userId);

    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body.comment;
    const userId = req.user.id;
    const result = await PostService.addComment(postId, comment, userId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await PostService.getAllComments(postId);
    res.status(comments.statusCode).json(comments);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const commentId = req.params.commentId;
    const userId = req.user.id;
    const result = await PostService.deleteComment(postId, commentId, userId);
    res.status(result.statusCode).json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    const posts = await PostService.searchPosts(query);
    res.status(posts.statusCode).json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// exports.getUserLikedPosts = async (req, res) => {
//   try {
//     const userId = req.params.id;
//     const posts = await PostService.getUserLikedPosts(userId);
//     res.json(posts);
//   } catch (error) {
//     res.status(400).json({ message: error.message });
//   }
// };
