import { LoginData, RegisterData, User } from '../types';
import client from './client';

export const signUp = async (data: RegisterData): Promise<User> => {
  const response = await client.post('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginData): Promise<User> => {
  const response = await client.post('/auth/login', data);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await client.post('/auth/logout');
};

export const getCurrentUser = async (): Promise<User> => {
  const response = await client.get('/auth/profile');
  return response.data;
};

export const getUserProfile = async (userId: string): Promise<User> => {
  const response = await client.get(`/auth/user/${userId}`);
  return response.data;
};

export const followUser = async (userId: string): Promise<User> => {
  const response = await client.post(`/auth/follow/${userId}`);
  return response.data;
};

export const unfollowUser = async (userId: string): Promise<User> => {
  const response = await client.post(`/auth/unfollow/${userId}`);
  return response.data;
};