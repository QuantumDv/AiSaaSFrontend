import React, { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  name: string;
  email: string;
  credits: number;
}

interface AuthContextType {
  authenticated: boolean;
  user: User | null;
  loading: boolean;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    setLoading(true);
    try {
      const response = await fetch('https://api.freezygig.com/api/auth/status', {
        method: 'GET',
        credentials: 'include', // important to send cookies
      });
      if (response.ok) {
        const data = await response.json();
        setAuthenticated(data.authenticated);
        setUser(data.user || null);
      } else {
        setAuthenticated(false);
        setUser(null);
      }
    } catch (error) {
      setAuthenticated(false);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ authenticated, user, loading, refreshAuth }}>
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

export { AuthContext };
export type { AuthContextType };
