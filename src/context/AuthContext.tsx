import { createContext, useState, useEffect, type ReactNode } from 'react';
import apiClient from '../services/api';

interface User {
  id: number;
  name: string;
  email: string;
  role?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  adminLogin: (credentials: LoginCredentials) => Promise<LoginResponse>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem('token');
    if (token) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Set auth header from localStorage
      setAuthHeader();
      
      const response = await apiClient.get('/user');
      setUser(response.data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Authentication check failed:', error);
      // Clear any invalid tokens
      localStorage.removeItem('token');
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const setAuthHeader = () => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common['Authorization'];
    }
  };

  const adminLogin = async (credentials: LoginCredentials): Promise<LoginResponse> => {
    try {
      const response = await apiClient.post('/login', credentials);
      const { access_token, user } = response.data;
      
      // Save token to localStorage
      localStorage.setItem('token', access_token);
      
      // Set axios auth header
      setAuthHeader();
      
      // Update state
      setUser(user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as any).response?.data?.message || error.message
        : 'Login failed. Please check your credentials.';
      
      console.error('Login failed:', errorMessage);
      return { 
        success: false, 
        message: errorMessage
      };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint
      await apiClient.post('/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear token and state regardless of API call success
      localStorage.removeItem('token');
      delete apiClient.defaults.headers.common['Authorization'];
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      loading,
      adminLogin, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;