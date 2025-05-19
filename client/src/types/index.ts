export interface User {
  _id: string;
  username: string;
  bio?: string;
  profilePicture?: string;
  followers: string[];
  following: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  _id: string;
  text: string;
  author: User;
  createdAt: Date;
}

export interface Post {
  _id: string;
  title: string;
  summary?: string;
  content: string;
  image?: string;
  author: User;
  likes: string[];
  comments: Comment[];
  tags?: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface PostFormData {
  title: string;
  summary?: string;
  content: string;
  image?: File | string;
}

export interface CommentFormData {
  text: string;
}