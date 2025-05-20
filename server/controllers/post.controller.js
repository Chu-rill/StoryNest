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
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getPost = async (req, res) => {
  try {
    const posts = await PostService.getAllPosts(20);
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;
    const limit = req.query.limit || 20;
    const posts = await PostService.getPostsByUserId(userId, limit);
    res.json(posts);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.viewPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await PostService.getPostById(id);
    res.json(post);
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

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await PostService.deletePost(postId, userId);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await PostService.likePost(postId, userId);

    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.unlikePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.id;
    const result = await PostService.unlikePost(postId, userId);

    res.json(result);
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
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getComments = async (req, res) => {
  try {
    const postId = req.params.id;
    const comments = await PostService.getAllComments(postId);
    res.json(comments);
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
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.searchPosts = async (req, res) => {
  try {
    const query = req.query.q;
    const posts = await PostService.searchPosts(query);
    res.json(posts);
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
