import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';
// IMPORTANTE: Importamos o tipo User centralizado que tem o 'role'
import type { User } from '../types';

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
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } catch (e) {
        console.error("Erro ao fazer parse do usuário", e);
        localStorage.removeItem('codeia_user');
        localStorage.removeItem('codeia_token');
      }
    }
    setLoading(false);
  }, []);

  const signIn = (token: string, userData: User) => {
    localStorage.setItem('codeia_token', token);
    localStorage.setItem('codeia_user', JSON.stringify(userData));
    
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('codeia_token');
    localStorage.removeItem('codeia_user');
    
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};