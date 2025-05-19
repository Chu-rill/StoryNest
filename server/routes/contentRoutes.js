const express = require("express");
const contentRoutes = express.Router();
const {
  post,
  getPost,
  viewPost,
  editPost,
} = require("../controllers/contentController");
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

contentRoutes.post("/post", upload.single("picture"), post);
contentRoutes.get("/post/:id", viewPost);
contentRoutes.get("/getPost", getPost);
contentRoutes.put("/edit/:id", upload.single("picture"), editPost);

module.exports = contentRoutes;
