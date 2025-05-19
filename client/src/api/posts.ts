import { CommentFormData, Post, PostFormData } from '../types';
import client from './client';

export const getAllPosts = async (page = 1, limit = 10): Promise<Post[]> => {
  const response = await client.get('/content/getPost', {
    params: { page, limit },
  });
  return response.data;
};

export const getPost = async (postId: string): Promise<Post> => {
  const response = await client.get(`/content/post/${postId}`);
  return response.data;
};

export const getUserPosts = async (userId: string, page = 1, limit = 10): Promise<Post[]> => {
  const response = await client.get(`/content/user/posts/${userId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const createPost = async (postData: PostFormData): Promise<Post> => {
  const formData = new FormData();
  formData.append('title', postData.title);
  
  if (postData.summary) {
    formData.append('summary', postData.summary);
  }
  
  formData.append('content', postData.content);
  
  if (postData.image && typeof postData.image !== 'string') {
    formData.append('image', postData.image);
  } else if (typeof postData.image === 'string') {
    formData.append('image', postData.image);
  }
  
  const response = await client.post('/content/post', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const updatePost = async (postId: string, postData: PostFormData): Promise<Post> => {
  const formData = new FormData();
  formData.append('title', postData.title);
  
  if (postData.summary) {
    formData.append('summary', postData.summary);
  }
  
  formData.append('content', postData.content);
  
  if (postData.image && typeof postData.image !== 'string') {
    formData.append('image', postData.image);
  } else if (typeof postData.image === 'string') {
    formData.append('image', postData.image);
  }
  
  const response = await client.put(`/content/edit/${postId}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

export const likePost = async (postId: string): Promise<Post> => {
  const response = await client.post(`/content/like/${postId}`);
  return response.data;
};

export const unlikePost = async (postId: string): Promise<Post> => {
  const response = await client.post(`/content/unlike/${postId}`);
  return response.data;
};

export const addComment = async (postId: string, commentData: CommentFormData): Promise<Post> => {
  const response = await client.post(`/content/comment/${postId}`, commentData);
  return response.data;
};

export const deleteComment = async (postId: string, commentId: string): Promise<Post> => {
  const response = await client.delete(`/content/comment/${postId}/${commentId}`);
  return response.data;
};

export const searchPosts = async (query: string, page = 1, limit = 10): Promise<Post[]> => {
  const response = await client.get('/content/search', {
    params: { query, page, limit },
  });
  return response.data;
};