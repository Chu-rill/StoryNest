import api from "./api";
import { Post, Comment, PostResponse } from "../types";

interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}

export const getPosts = async (
  params: GetPostsParams = {}
): Promise<{ posts: Post[]; total: number; pages: number }> => {
  try {
    const response = await api.get("/content/getPost", { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPostById = async (postId: string): Promise<Post> => {
  try {
    const response = await api.get<Post>(`/content/post/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPost = async (postData: Partial<Post>): Promise<Post> => {
  try {
    const response = await api.post<Post>("/content/post", postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  postData: Partial<Post>
): Promise<Post> => {
  try {
    const response = await api.put<Post>(`/content/edit/${postId}`, postData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const likePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post<Post>(`/content/like/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unlikePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post<Post>(`/content/unlike/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getComments = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await api.get<Comment[]>(`/content/comments/${postId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const addComment = async (
  postId: string,
  content: string
): Promise<Comment> => {
  try {
    const response = await api.post<Comment>(`/content/comment/${postId}`, {
      content,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteComment = async (
  postId: string,
  commentId: string
): Promise<void> => {
  try {
    await api.delete(`/content/comment/${postId}/${commentId}`);
  } catch (error) {
    throw error;
  }
};

export const searchPosts = async (query: string): Promise<Post[]> => {
  try {
    const response = await api.get<Post[]>(`/content/search?q=${query}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserPosts = async (userId: string): Promise<PostResponse> => {
  try {
    const response = await api.get<PostResponse>(
      `/content/user/posts/${userId}`
    );
    console.log("User Posts:", response.data.posts);
    return response.data;
  } catch (error) {
    throw error;
  }
};
