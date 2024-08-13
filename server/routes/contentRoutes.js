const express = require("express");
const contentRoutes = express.Router();
const { post, getPost, viewPost } = require("../controllers/contentController");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });

contentRoutes.post("/post", uploadMiddleware.single("file"), post);
contentRoutes.get("/post/:id", viewPost);
contentRoutes.get("/getPost", getPost);

module.exports = contentRoutes;
