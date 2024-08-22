const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const contentRoutes = require("./routes/contentRoutes");
const path = require("path");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://nspire-xrhy.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(cookieParser());

const port = process.env.PORT;
const URI = process.env.MONGODB_URL || "mongodb://localhost:27017/blog";

mongoose
  .connect(URI, {
    // serverSelectionTimeoutMS: 3000000,
  })
  .then(() => {
    console.log("Connected to the database");
    app.listen(port, () => {
      console.log(`Server started on port 3001`);
    });
  })
  .catch((error) => {
    console.log("Connection failed");
    console.error("Connection failed", error);
  });

app.use((req, res, next) => {
  res.setTimeout(120000); // Set timeout to 2 minutes
  next();
});

app.get("/", (req, res) => {
  res.send({ message: "success" });
});
app.use("/auth", authRoutes);
app.use("/content", contentRoutes);
