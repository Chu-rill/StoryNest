const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String, 
    required: true,
    min: 4,
    unique: true,
  },
  password: {
    type: String,
    required: true, 
    min: 4,
  },
  email: {
    type: String,
    unique: true,
    sparse: true
  },
  bio: {
    type: String,
    maxLength: 160
  },
  profilePicture: {
    type: String,
    default: ''
  },
  followers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  following: [{
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  }]
}, {
  timestamps: true
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
