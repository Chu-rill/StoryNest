const express = require("express");
const contentRoutes = express.Router();
const {
  post,
  getPost,
  viewPost,
  editPost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
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
contentRoutes.get("/getPost", getPost);
contentRoutes.get("/post/:id", viewPost);
contentRoutes.get("/search", searchPosts);

// Protected routes requiring authentication
contentRoutes.post("/post", authenticate, upload.single("picture"), post);
contentRoutes.put(
  "/edit/:id",
  authenticate,
  upload.single("picture"),
  editPost
);
contentRoutes.post("/like/:id", authenticate, likePost);
contentRoutes.post("/unlike/:id", authenticate, unlikePost);
contentRoutes.post("/comment/:id", authenticate, addComment);
contentRoutes.delete(
  "/comment/:postId/:commentId",
  authenticate,
  deleteComment
);
contentRoutes.get("/user/posts/:userId", authenticate, getUserPosts);

module.exports = contentRoutes;
