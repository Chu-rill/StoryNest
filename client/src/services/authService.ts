import api from "./api";
import { User, AuthResponse, UserResponse } from "../types";

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>("/auth/signup", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const logoutUser = async (): Promise<void> => {
  try {
    await api.post("/auth/logout");
    localStorage.removeItem("token");
  } catch (error) {
    throw error;
  }
};

export const getUserProfile = async (): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>("/auth/profile");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserProfile = async (
  userData: Partial<User>
): Promise<User> => {
  try {
    const response = await api.put<User>("/auth/update", userData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getUserById = async (userId: string): Promise<UserResponse> => {
  try {
    const response = await api.get<UserResponse>(`/auth/user/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const followUser = async (userId: string): Promise<User> => {
  try {
    const response = await api.post<User>(`/auth/follow/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const unfollowUser = async (userId: string): Promise<User> => {
  try {
    const response = await api.post<User>(`/auth/unfollow/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
