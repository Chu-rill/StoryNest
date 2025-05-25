import api from "./api";
import {
  Post,
  Comment,
  PostResponse,
  SinglePostResponse,
  CommentResponse,
  SharePostResponse,
  UpdatePostResponse,
} from "../types";

// =============================================
// INTERFACES
// =============================================
interface GetPostsParams {
  page?: number;
  limit?: number;
  category?: string;
  tag?: string;
}

interface GetSharedPostsResponse {
  posts: Post[];
  total: number;
  pages: number;
}

// =============================================
// POST CRUD OPERATIONS
// =============================================
export const getPosts = async (
  params: GetPostsParams = {}
): Promise<{ posts: Post[]; total: number; pages: number }> => {
  try {
    const response = await api.get("/content/getPost", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
};

export const getPostById = async (
  postId: string
): Promise<SinglePostResponse> => {
  try {
    const response = await api.get<SinglePostResponse>(
      `/content/post/${postId}`
    );

    return response.data;
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error);
    throw error;
  }
};

export const createPost = async (postData: Partial<Post>): Promise<Post> => {
  try {
    const response = await api.post<Post>("/content/post", postData);
    return response.data;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};

export const updatePost = async (
  postId: string,
  postData: Partial<Post>
): Promise<UpdatePostResponse> => {
  try {
    const response = await api.put<UpdatePostResponse>(
      `/content/edit/${postId}`,
      postData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating post ${postId}:`, error);
    throw error;
  }
};

export const deletePost = async (postId: string): Promise<void> => {
  try {
    await api.delete(`/content/post/${postId}`);
  } catch (error) {
    console.error(`Error deleting post ${postId}:`, error);
    throw error;
  }
};

// =============================================
// POST INTERACTIONS (LIKE/UNLIKE)
// =============================================
export const likePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post<Post>(`/content/like/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error liking post ${postId}:`, error);
    throw error;
  }
};

export const unlikePost = async (postId: string): Promise<Post> => {
  try {
    const response = await api.post<Post>(`/content/unlike/${postId}`);
    return response.data;
  } catch (error) {
    console.error(`Error unliking post ${postId}:`, error);
    throw error;
  }
};

// =============================================
// POST SHARING OPERATIONS
// =============================================
export const sharePost = async (postId: string): Promise<SharePostResponse> => {
  try {
    const response = await api.post<SharePostResponse>(
      `/content/posts/${postId}/share`
    );
    return response.data;
  } catch (error) {
    console.error(`Error sharing post ${postId}:`, error);
    throw error;
  }
};

export const unsharePost = async (
  postId: string
): Promise<SharePostResponse> => {
  try {
    const response = await api.delete<SharePostResponse>(
      `/content/share/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error unsharing post ${postId}:`, error);
    throw error;
  }
};

export const getSharedPosts = async (
  userId?: string,
  params: GetPostsParams = {}
): Promise<GetSharedPostsResponse> => {
  try {
    const endpoint = userId
      ? `/content/user/${userId}/shared-posts`
      : "/content/shared-posts";

    const response = await api.get<GetSharedPostsResponse>(endpoint, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching shared posts:", error);
    throw error;
  }
};

// =============================================
// COMMENT OPERATIONS
// =============================================
export const getComments = async (postId: string): Promise<CommentResponse> => {
  try {
    const response = await api.get<CommentResponse>(
      `/content/comments/${postId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error);
    throw error;
  }
};

export const addComment = async (
  postId: string,
  comment: string
): Promise<CommentResponse> => {
  try {
    const response = await api.post<CommentResponse>(
      `/content/comment/${postId}`,
      { comment }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding comment to post ${postId}:`, error);
    throw error;
  }
};

export const updateComment = async (
  postId: string,
  commentId: string,
  comment: string
): Promise<CommentResponse> => {
  try {
    const response = await api.put<CommentResponse>(
      `/content/comment/${postId}/${commentId}`,
      { comment }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error);
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
    console.error(`Error deleting comment ${commentId}:`, error);
    throw error;
  }
};

// =============================================
// SEARCH & USER POSTS
// =============================================
export const searchPosts = async (
  query: string,
  params: GetPostsParams = {}
): Promise<{ posts: Post[]; total: number; pages: number }> => {
  try {
    const response = await api.get<{
      posts: Post[];
      total: number;
      pages: number;
    }>(`/content/search`, {
      params: {
        q: query,
        ...params,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error searching posts with query "${query}":`, error);
    throw error;
  }
};

export const getUserPosts = async (
  userId: string,
  params: GetPostsParams = {}
): Promise<PostResponse> => {
  try {
    const response = await api.get<PostResponse>(
      `/content/user/posts/${userId}`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    throw error;
  }
};
