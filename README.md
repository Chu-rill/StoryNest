# StoryNest

A modern social blogging platform built with React, Node.js, and MongoDB.

## Overview

StoryNest is a full-featured social blogging platform that allows users to create, share, and discover content. The platform supports rich text editing, image uploads, user interactions like comments and likes, and real-time notifications.

## Project Structure

```
├── client/          # Frontend React application
├── server/          # Backend Node.js API
└── uploads/         # Uploaded media files
```

## Core Features

- 📝 Rich text posts with image support
- 👥 User profiles with follow system
- ❤️ Like and comment on posts
- 🔄 Share posts with others
- 🏷️ Tag and categorize content
- 🌓 Dark mode support
- 📱 Responsive design

## Tech Stack

### Frontend

- React + TypeScript
- TailwindCSS
- React Query
- React Hook Form
- React Hot Toast

### Backend

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- Cloudinary (Image hosting)

## Getting Started

1. Clone the repository
2. Set up environment variables (see `.env.example` files)
3. Install dependencies:

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd server && npm install
```

4. Run the development servers:

```bash
# Run client
cd client && npm run dev

# Run server
cd server && npm run dev
```

## License

[MIT](LICENSE)
