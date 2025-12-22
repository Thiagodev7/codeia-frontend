import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '../lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
}

interface AuthContextType {
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('codeia_user');
    const token = localStorage.getItem('codeia_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Garante que o token esteja no header caso a pagina seja recarregada
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const signIn = (token: string, userData: User) => {
    localStorage.setItem('codeia_token', token);
    localStorage.setItem('codeia_user', JSON.stringify(userData));
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('codeia_token');
    localStorage.removeItem('codeia_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);