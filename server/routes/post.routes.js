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
  sharePost,
  deletePost,
} = require("../controllers/post.controller");
const { protect } = require("../middleware/jwt");
const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const validator = require("../middleware/validation");
const postValidation = require("../validation/post.validation");

// Public routes
postRoutes.get("/getPost", getPost);
postRoutes.get("/post/:id", viewPost);
postRoutes.get("/search", searchPosts);

// Protected routes requiring authentication
postRoutes.post(
  "/post",
  validator.validateSchema(postValidation.create),
  protect,
  post
);
postRoutes.put(
  "/edit/:id",
  validator.validateSchema(postValidation.update),
  protect,
  editPost
);
postRoutes.delete("/post/:id", protect, deletePost);
postRoutes.post("/like/:id", protect, likePost);
postRoutes.post("/unlike/:id", protect, unlikePost);
postRoutes.get("/comments/:id", protect, getComments);
postRoutes.post(
  "/comment/:id",
  validator.validateSchema(postValidation.comment),
  protect,
  addComment
);
postRoutes.delete("/comment/:id/:commentId", protect, deleteComment);
postRoutes.get("/user/posts/:userId", protect, getUserPosts);
postRoutes.post("/posts/:postId/share", protect, sharePost);

module.exports = postRoutes;
