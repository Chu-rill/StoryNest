const fs = require("fs");
const path = require("path");
const Post = require("../model/postModel");
const jwt = require("jsonwebtoken");
exports.post = async (req, res) => {
  const { originalname, path } = req.file;
  const parts = originalname.split(".");
  const fileExtension = parts[parts.length - 1];
  const newPath = path + "." + fileExtension;
  fs.renameSync(path, newPath);

  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, async (error, info) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }
    const { title, summary, content } = req.body;

    const post = await Post.create({
      title,
      summary,
      content,
      image: newPath,
      author: info.id,
    });
    res.json(post);
  });
};
exports.getPost = async (req, res) => {
  const posts = await Post.find()
    .limit(20) // Limit the number of posts
    .populate({
      path: "author",
      select: "username", // Project only the 'username' field from the author document
    });

  res.json(posts);
};
exports.viewPost = async (req, res) => {
  const { id } = req.params;
  const post = await Post.findById(id).populate("author", ["username"]);
  res.send({ post });
};
exports.editPost = async (req, res) => {
  let newPath = null;
  if (req.file) {
    const { originalname, path: oldPath } = req.file;
    const parts = originalname.split(".");
    const fileExtension = parts[parts.length - 1];
    newPath = oldPath + "." + fileExtension;
    fs.renameSync(oldPath, newPath);
  }

  const token = req.cookies.token;
  jwt.verify(token, process.env.JWT_SECRET, async (error, info) => {
    if (error) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const { title, summary, content, id } = req.body;
    try {
      const post = await Post.findById(id);

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      const isAuthor = post.author.toString() === info.id;

      if (!isAuthor) {
        return res.status(403).json({ message: "You are not the author" });
      }

      const updatedPost = await Post.findByIdAndUpdate(
        id,
        {
          title,
          summary,
          content,
          image: newPath ? newPath : post.image,
        },
        { new: true, runValidators: true }
      );

      res.json(updatedPost);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  });
};
