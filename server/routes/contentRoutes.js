const express = require("express");
const contentRoutes = express.Router();
const {
  post,
  getPost,
  viewPost,
  editPost,
} = require("../controllers/contentController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

contentRoutes.post("/post", uploadMiddleware.single("file"), post);
contentRoutes.get("/post/:id", viewPost);
contentRoutes.get("/getPost", getPost);
contentRoutes.put("/edit/:id", uploadMiddleware.single("file"), editPost);

module.exports = contentRoutes;
