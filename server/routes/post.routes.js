const express = require("express");
const postRoutes = express.Router();
const {
  post,
  getPost,
  viewPost,
  editPost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
  getComments,
  searchPosts,
  getUserPosts,
} = require("../controllers/post.controller");
const { authenticate } = require("../middleware/jwt");
const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});

const upload = multer({ storage: storage });

// Public routes
postRoutes.get("/getPost", getPost);
postRoutes.get("/post/:id", viewPost);
postRoutes.get("/search", searchPosts);

// Protected routes requiring authentication
postRoutes.post("/post", authenticate, upload.single("picture"), post);
postRoutes.put("/edit/:id", authenticate, upload.single("picture"), editPost);
postRoutes.post("/like/:id", authenticate, likePost);
postRoutes.post("/unlike/:id", authenticate, unlikePost);
postRoutes.get("/comments/:id", authenticate, getComments);
postRoutes.post("/comment/:id", authenticate, addComment);
postRoutes.delete("/comment/:postId/:commentId", authenticate, deleteComment);
postRoutes.get("/user/posts/:userId", authenticate, getUserPosts);

module.exports = postRoutes;
