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
const { protect } = require("../middleware/jwt");
const cloudinary = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");
const validator = require("../middleware/validation");
const postValidation = require("../validation/post.validation");

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
postRoutes.post(
  "/post",
  validator.validateSchema(postValidation.create),
  protect,
  upload.single("picture"),
  post
);
postRoutes.put(
  "/edit/:id",
  validator.validateSchema(postValidation.update),
  protect,
  upload.single("picture"),
  editPost
);
postRoutes.post("/like/:id", protect, likePost);
postRoutes.post("/unlike/:id", protect, unlikePost);
postRoutes.get("/comments/:id", protect, getComments);
postRoutes.post(
  "/comment/:id",
  validator.validateSchema(postValidation.comment),
  protect,
  addComment
);
postRoutes.delete("/comment/:postId/:commentId", protect, deleteComment);
postRoutes.get("/user/posts/:userId", protect, getUserPosts);

module.exports = postRoutes;
