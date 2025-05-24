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
    // Add shares tracking
    shares: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        sharedAt: {
          type: Date,
          default: Date.now,
        },
        // Optional: track share method (native, clipboard, etc.)
        shareMethod: {
          type: String,
          enum: ["native", "clipboard", "social"],
          default: "native",
        },
      },
    ],
    // Add share count for quick access (denormalized for performance)
    shareCount: {
      type: Number,
      default: 0,
      min: 0,
    },
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

// Add indexes for performance
PostSchema.index({ author: 1, createdAt: -1 }); // For author's posts
PostSchema.index({ createdAt: -1 }); // For recent posts
PostSchema.index({ "shares.user": 1 }); // For checking if user shared
PostSchema.index({ shareCount: -1 }); // For sorting by popularity

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
