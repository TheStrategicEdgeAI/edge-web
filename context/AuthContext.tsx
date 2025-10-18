import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export interface User {
  email: string;
  token: string;
  id: string;
}

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load user from localStorage on mount
    const stored = localStorage.getItem('edgeAuth');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch {
        localStorage.removeItem('edgeAuth');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    // Call the backend to get a token. In a real app this would send a magic link.
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const resp = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const data = await resp.json();
    if (!resp.ok) {
      throw new Error(data.error || 'Login failed');
    }
    const newUser: User = { email, token: data.token, id: email };
    setUser(newUser);
    localStorage.setItem('edgeAuth', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('edgeAuth');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}

// Export useAuth as the default export so it can be imported without curly braces.
export default useAuth;
