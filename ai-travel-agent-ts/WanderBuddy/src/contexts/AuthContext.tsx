
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name?: string;
  hasProfile?: boolean;
  access_token?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  updateUser: (userData: any) => void;
}

interface UserProfile {
  name: string;
  nationality: string;
  // ...add more fields if needed
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const API_BASE_URL = 'http://127.0.0.1:10000';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('travel_agent_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      // Check if user has profile
      if (userData.access_token && userData.id) {
        checkUserProfile(userData.id, userData.access_token);
      }
    }
  }, []);

  const checkUserProfile = async (userId: string, token: string) => {
    try {
      console.log('Checking profile for user:', userId);
      const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Profile check response status:', response.status);
      
      if (response.ok) {
        const profileData = await response.json();
        console.log('Profile data found:', profileData);
        setUser(prev => prev ? { ...prev, hasProfile: true } : null);
        const updatedUser = { ...JSON.parse(localStorage.getItem('travel_agent_user') || '{}'), hasProfile: true };
        localStorage.setItem('travel_agent_user', JSON.stringify(updatedUser));
      } else if (response.status === 404) {
        // User profile doesn't exist
        console.log('No profile found for user');
        setUser(prev => prev ? { ...prev, hasProfile: false } : null);
        const updatedUser = { ...JSON.parse(localStorage.getItem('travel_agent_user') || '{}'), hasProfile: false };
        localStorage.setItem('travel_agent_user', JSON.stringify(updatedUser));
      } else {
        console.error('Error checking profile:', response.status);
        setUser(prev => prev ? { ...prev, hasProfile: false } : null);
      }
    } catch (error) {
      console.error('Error checking user profile:', error);
      setUser(prev => prev ? { ...prev, hasProfile: false } : null);
    }
  };

  const checkUserHasProfile = async (userId: string, token: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/user/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};


  const login = async (email: string, password: string) => {
  setIsLoading(true);
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    const userData = {
      id: data.user_id || email,
      email,
      access_token: data.access_token,
    };

    // Wait for profile check to complete first
    const hasProfile = await checkUserHasProfile(userData.id, data.access_token);

    setUser({ ...userData, hasProfile });
    localStorage.setItem('travel_agent_user', JSON.stringify({ ...userData, hasProfile }));
  } catch (error) {
    throw error;
  } finally {
    setIsLoading(false);
  }
};


  const register = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      // After successful registration, login the user
      await login(email, password);
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = (userData: any) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
    const savedUser = localStorage.getItem('travel_agent_user');
    if (savedUser) {
      const updatedUser = { ...JSON.parse(savedUser), ...userData };
      localStorage.setItem('travel_agent_user', JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('travel_agent_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isLoading,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};
