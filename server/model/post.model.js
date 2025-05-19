const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    comments: [
      {
        text: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    tags: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      enum: ["Technology", "Travel", "Food", "Lifestyle", "Other"],
      default: "Other",
    },
  },
  {
    timestamps: true,
  }
);

// Add index for search functionality
PostSchema.index({ title: "text", content: "text", tags: "text" });

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
