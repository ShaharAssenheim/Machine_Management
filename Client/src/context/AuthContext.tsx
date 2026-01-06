import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG, AUTH_CONFIG } from '../constants';

const { BASE_URL } = API_CONFIG;
const { TOKEN_KEY, USER_KEY } = AUTH_CONFIG;

interface User {
  username: string;
  email: string;
  isAdmin: boolean;
  requirePasswordChange: boolean;
}

interface AuthResponse {
  token: string;
  username: string;
  email: string;
  isAdmin: boolean;
  requirePasswordChange: boolean;
  expiresAt: string;
}

interface RegisterData {
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  clearPasswordChangeRequirement: () => void;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem(TOKEN_KEY);
    const storedUser = localStorage.getItem(USER_KEY);
    
    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setToken(storedToken);
        setUser(parsedUser);
      } catch (err) {
        console.error('Failed to parse stored user data:', err);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData) => {
    try {
      setError(null);
      setIsLoading(true);
      
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
        throw new Error(errorData.message || 'Login failed');
      }

      const authData: AuthResponse = await response.json();
      
      const userData: User = {
        username: authData.username,
        email: authData.email,
        isAdmin: authData.isAdmin,
        requirePasswordChange: authData.requirePasswordChange,
      };

      setToken(authData.token);
      setUser(userData);
      
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Login failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      setIsLoading(true);

      const response = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(errorData.message || 'Registration failed');
      }

      const authData: AuthResponse = await response.json();
      
      const userData: User = {
        username: authData.username,
        email: authData.email,
        isAdmin: authData.isAdmin,
        requirePasswordChange: authData.requirePasswordChange,
      };

      setToken(authData.token);
      setUser(userData);
      
      localStorage.setItem(TOKEN_KEY, authData.token);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Registration failed';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  const clearPasswordChangeRequirement = () => {
    if (user) {
      const updatedUser = { ...user, requirePasswordChange: false };
      setUser(updatedUser);
      localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    register,
    logout,
    clearPasswordChangeRequirement,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
