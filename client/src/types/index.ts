export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture: string;
  profileBackground: string;
  followers: any[];
  following: any[];
  createdAt: string;
}

export interface UserResponse {
  message: string;
  status: string;
  statusCode: number;
  profile: User;
}

// followers: any[];
//   following: any[];

export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  tags: string[];
  category: string;
  author: User | null;
  likes: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostResponse {
  message: string;
  status: string;
  statusCode: number;
  posts: Post;
  totalPosts: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  postId: string;
  createdAt: string;
}

export interface AuthResponse {
  status: string;
  statusCode: number;
  message: string;
  token: string;
  user: User;
}

export type ThemeMode = "light" | "dark";
