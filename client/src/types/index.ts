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

export interface Post {
  id: string;
  title: string;
  summary: string;
  content: string;
  image?: string;
  tags: string[];
  category: string;
  author: User | null;
  likes: any[];
  commentsCount: number;
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
  shares: any[];
  shareCount: number;
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
export interface SharePostResponse {
  success: string;
  statusCode: number;
  post: Post;
  isNewShare: boolean;
  message: string;
}
export interface SinglePostResponse {
  status: string;
  message: string;
  statusCode: number;
  post: Post;
}

export interface Comment {
  id: string;
  text: string;
  author: User;
  createdAt: string;
}

export interface CommentResponse {
  status: string;
  statusCode: number;
  message: string;
  comments: Comment[];
}

export interface AuthResponse {
  status: string;
  statusCode: number;
  message: string;
  token: string;
  user: User;
}

export type ThemeMode = "light" | "dark";
