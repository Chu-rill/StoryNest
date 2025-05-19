import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import * as authApi from '../api/auth';
import { AuthState, LoginData, RegisterData, User } from '../types';

interface AuthContextType extends AuthState {
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  // Check if user is logged in on initial load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const user = await authApi.getCurrentUser();
        setState({ user, isLoading: false, error: null });
      } catch (error) {
        setState({ user: null, isLoading: false, error: null });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (data: LoginData) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await authApi.login(data);
      setState({ user, isLoading: false, error: null });
      toast.success('Logged in successfully');
    } catch (error: any) {
      setState({ 
        ...state, 
        isLoading: false, 
        error: error.response?.data?.message || 'Login failed' 
      });
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    setState({ ...state, isLoading: true, error: null });
    try {
      const user = await authApi.signUp(data);
      setState({ user, isLoading: false, error: null });
      toast.success('Registered successfully');
    } catch (error: any) {
      setState({ 
        ...state, 
        isLoading: false, 
        error: error.response?.data?.message || 'Registration failed' 
      });
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = async () => {
    setState({ ...state, isLoading: true, error: null });
    try {
      await authApi.logout();
      setState({ user: null, isLoading: false, error: null });
      toast.success('Logged out successfully');
    } catch (error: any) {
      setState({ 
        ...state, 
        isLoading: false, 
        error: error.response?.data?.message || 'Logout failed' 
      });
      toast.error('Logout failed');
    }
  };

  const followUser = async (userId: string) => {
    try {
      const updatedUser = await authApi.followUser(userId);
      setState({ ...state, user: updatedUser });
      toast.success('Successfully followed user');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to follow user');
      throw error;
    }
  };

  const unfollowUser = async (userId: string) => {
    try {
      const updatedUser = await authApi.unfollowUser(userId);
      setState({ ...state, user: updatedUser });
      toast.success('Successfully unfollowed user');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to unfollow user');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        followUser,
        unfollowUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};