# StoryNest Backend API

Express-based backend API for the StoryNest blogging platform.

## Tech Stack

- Node.js
- Express
- MongoDB + Mongoose
- JWT Authentication
- Joi Validation
- Cloudinary
- Nodemailer

## Project Structure

```
├── controllers/     # Request handlers
├── middleware/      # Express middleware
├── models/         # Mongoose models
├── repository/     # Database operations
├── routes/         # API routes
├── services/       # Business logic
├── utils/          # Utility functions
└── validation/     # Request validation schemas
```

## API Routes

### Auth Routes

- POST `/auth/signup` - Register new user
- POST `/auth/login` - User login
- POST `/auth/logout` - User logout
- GET `/auth/profile` - Get user profile
- PUT `/auth/update` - Update user profile

### Post Routes

- GET `/content/getPost` - Get all posts
- GET `/content/post/:id` - Get single post
- POST `/content/post` - Create new post
- PUT `/content/edit/:id` - Update post
- DELETE `/content/post/:id` - Delete post
- POST `/content/like/:id` - Like post
- POST `/content/unlike/:id` - Unlike post
- POST `/content/comment/:id` - Add comment

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:
   Copy `.env.example` to `.env` and fill in your values:

```
MONGODB_URL=mongodb://localhost:27017/storynest
JWT_SECRET=your_jwt_secret
PORT=3001
```

3. Run development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server
- `npm run build` - Install dependencies and build client
