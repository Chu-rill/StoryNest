const fs = require("fs");
const PostService = require("../service/post.service");
const jwt = require("jsonwebtoken");

exports.post = async (req, res) => {
  try {
    const postData = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
      image: req.file.path,
      author: req.user.id,
    };

    const post = await PostService.createPost(postData);
    res.status(201).json(post);
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

exports.viewPost = async (req, res) => {
  try {
    const post = await PostService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ post });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.editPost = async (req, res) => {
  try {
    const updateData = {
      title: req.body.title,
      summary: req.body.summary,
      content: req.body.content,
    };

    if (req.file) {
      updateData.image = req.file.path;
    }

    const post = await PostService.updatePost(req.params.id, updateData);
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
