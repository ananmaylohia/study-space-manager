import React, { createContext, useContext, useState, ReactNode } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface User {
  id: string;
  user_id: number;
  email: string;
  name: string;
  role: 'student' | 'admin';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, role: 'student' | 'admin') => Promise<void>;
  logout: () => void;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  const login = async (email: string, role: 'student' | 'admin') => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      if (response.ok) {
        const dbUser = await response.json();
        setUser({
          id: dbUser.id.toString(),
          user_id: dbUser.id,
          email: dbUser.email,
          name: dbUser.email.split('@')[0],
          role: dbUser.role,
        });
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.warn('Backend not available, using local user');
      setUser({
        id: Math.random().toString(36).substr(2, 9),
        user_id: 0,
        email,
        name: email.split('@')[0],
        role,
      });
    }
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
