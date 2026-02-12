# Migration Guide: Express + MongoDB → NestJS + Prisma + PostgreSQL

## Overview

The server has been completely rewritten using:
- **NestJS** - A progressive Node.js framework with TypeScript
- **Prisma** - Modern ORM for PostgreSQL
- **PostgreSQL** - Relational database instead of MongoDB
- **TypeScript** - Type-safe development

## Prerequisites

1. **PostgreSQL Database**
   - Install PostgreSQL locally or use a cloud service (e.g., Supabase, Neon, Railway)
   - Create a database named `storynest` (or any name you prefer)

2. **Node.js** version 18 or higher

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update your `.env` file with the following:

```env
# Database (REQUIRED - Replace with your PostgreSQL connection string)
DATABASE_URL=postgresql://username:password@localhost:5432/storynest?schema=public

# JWT Secret (REQUIRED)
JWT_SECRET=your-jwt-secret-key

# Server Configuration
PORT=3001
NODE_ENV=development

# Email Configuration (Optional - for welcome emails)
EMAIL_PROVIDER=smtp.gmail.com
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
SERVICE_PORT=587

# Cloudinary (Optional - for image uploads)
API_KEY=your-cloudinary-api-key
API_SECRET=your-cloudinary-api-secret
CLOUD_NAME=your-cloudinary-cloud-name
```

### 3. Run Database Migration

This will create all the necessary tables in PostgreSQL:

```bash
npm run prisma:migrate
```

When prompted, enter a name for the migration (e.g., "init")

### 4. Generate Prisma Client

```bash
npm run prisma:generate
```

### 5. Start the Server

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm run start:prod
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build the application for production
- `npm run start:prod` - Start production server
- `npm run prisma:generate` - Generate Prisma client after schema changes
- `npm run prisma:migrate` - Create and run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)

## Database Schema Changes

### Key Differences from MongoDB:

1. **UUIDs instead of ObjectIds** - All IDs are now UUID strings
2. **Separate Tables for Relations**:
   - `Follow` table for user followers/following relationships
   - `Like` table for post likes
   - `Comment` table for post comments
   - `Share` table for post shares

3. **Proper Relational Structure**:
   - Foreign keys ensure data integrity
   - Cascade deletes (e.g., deleting a user deletes their posts, comments, likes)
   - Unique constraints prevent duplicate likes/follows/shares

### Models

- **User** - User accounts with authentication
- **Post** - Blog posts/content
- **Comment** - Comments on posts
- **Like** - Post likes
- **Share** - Post shares
- **Follow** - User follow relationships

## API Endpoints

All endpoints remain the same! The API is fully backward compatible:

### Authentication (`/auth`)
- `POST /auth/signup` - Register new user
- `POST /auth/login` - User login
- `POST /auth/logout` - Logout (clears session)
- `GET /auth/profile` - Get current user profile
- `GET /auth/users` - Get all users
- `POST /auth/follow/:id` - Follow a user
- `POST /auth/unfollow/:id` - Unfollow a user
- `PUT /auth/update` - Update user profile
- `GET /auth/user/:id` - Get specific user profile

### Content (`/content`)
- `GET /content/getPost` - Get all posts (with pagination)
- `GET /content/post/:id` - Get single post
- `GET /content/search` - Search posts
- `POST /content/post` - Create new post
- `PUT /content/edit/:id` - Update post
- `DELETE /content/post/:id` - Delete post
- `POST /content/like/:id` - Like a post
- `POST /content/unlike/:id` - Unlike a post
- `GET /content/comments/:id` - Get post comments
- `POST /content/comment/:id` - Add comment
- `DELETE /content/comment/:id/:commentId` - Delete comment
- `GET /content/user/posts/:userId` - Get user's posts
- `POST /content/posts/:postId/share` - Share a post

### Health Check
- `GET /health` - Server health status

## Architecture Overview

### Folder Structure

```
server/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── decorators/    # Custom decorators (Public, etc.)
│   │   ├── dto/           # Data Transfer Objects
│   │   ├── guards/        # JWT Auth Guard
│   │   ├── strategies/    # Passport JWT Strategy
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.module.ts
│   ├── post/              # Post/Content module
│   │   ├── dto/
│   │   ├── post.controller.ts
│   │   ├── post.service.ts
│   │   └── post.module.ts
│   ├── user/              # User module
│   │   ├── dto/
│   │   ├── user.service.ts
│   │   └── user.module.ts
│   ├── prisma/            # Prisma module
│   │   ├── prisma.service.ts
│   │   └── prisma.module.ts
│   ├── mail/              # Email module
│   │   ├── mail.service.ts
│   │   └── mail.module.ts
│   ├── common/            # Shared utilities
│   │   ├── decorators/    # CurrentUser decorator
│   │   ├── exceptions/    # Custom exception classes
│   │   └── filters/       # Global exception filter
│   ├── app.module.ts      # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   └── schema.prisma      # Database schema
├── views/                 # Email templates
│   └── welcome.hbs
├── prisma.config.ts       # Prisma configuration
├── tsconfig.json          # TypeScript configuration
└── nest-cli.json          # NestJS CLI configuration
```

### Key Features

1. **Type Safety** - Full TypeScript support with strict typing
2. **Validation** - Automatic request validation using class-validator
3. **JWT Authentication** - Secure token-based authentication
4. **Global Exception Handling** - Consistent error responses
5. **Dependency Injection** - Clean, testable architecture
6. **Modular Structure** - Organized by feature modules

## Migration Checklist

- [ ] Install PostgreSQL
- [ ] Create database
- [ ] Update `.env` with `DATABASE_URL`
- [ ] Run `npm install`
- [ ] Run `npm run prisma:migrate`
- [ ] Run `npm run prisma:generate`
- [ ] Test the server with `npm run dev`
- [ ] Migrate your MongoDB data to PostgreSQL (if needed)
- [ ] Update any frontend API calls (should work as-is)

## Data Migration (Optional)

If you have existing data in MongoDB, you'll need to migrate it to PostgreSQL. You can:

1. Export data from MongoDB using `mongoexport`
2. Transform the data format (ObjectId → UUID, etc.)
3. Import into PostgreSQL using Prisma or raw SQL

Or use a migration script to read from MongoDB and write to PostgreSQL.

## Troubleshooting

### "Cannot connect to database"
- Ensure PostgreSQL is running
- Check your `DATABASE_URL` in `.env`
- Test connection with: `npx prisma db push`

### "Prisma Client not found"
- Run: `npm run prisma:generate`

### Build errors
- Delete `node_modules` and `dist` folders
- Run: `npm install && npm run build`

### Port already in use
- Change `PORT` in `.env`
- Or kill the process using port 3001: `lsof -ti:3001 | xargs kill`

## Benefits of This Migration

1. **Type Safety** - Catch errors at compile time
2. **Better Performance** - PostgreSQL is faster for relational queries
3. **Data Integrity** - Foreign keys and constraints prevent bad data
4. **Scalability** - NestJS architecture scales better
5. **Modern Stack** - Industry-standard technologies
6. **Better DX** - Auto-completion, refactoring, debugging

## Support

For issues or questions:
- Check NestJS documentation: https://docs.nestjs.com
- Check Prisma documentation: https://www.prisma.io/docs
- Review the code in `src/` folder

## Next Steps

1. Set up your PostgreSQL database
2. Run the migration
3. Test all endpoints
4. Migrate your data (if applicable)
5. Update any deployment configurations
6. Deploy! 🚀
