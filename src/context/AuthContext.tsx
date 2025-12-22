import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../lib/api';

// Definição do Tipo de Usuário
export interface User {
  id: string;
  name: string;
  email: string;
  tenantId: string;
}

// Definição do Tipo do Contexto
interface AuthContextType {
  user: User | null;
  signIn: (token: string, user: User) => void;
  signOut: () => void;
  loading: boolean;
}

// Criação do Contexto
const AuthContext = createContext({} as AuthContextType);

// Provider
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('codeia_user');
    const token = localStorage.getItem('codeia_token');

    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
      // Configura o token no Axios para futuras requisições
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    setLoading(false);
  }, []);

  const signIn = (token: string, userData: User) => {
    localStorage.setItem('codeia_token', token);
    localStorage.setItem('codeia_user', JSON.stringify(userData));
    
    // Configura o token imediatamente após o login
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    setUser(userData);
  };

  const signOut = () => {
    localStorage.removeItem('codeia_token');
    localStorage.removeItem('codeia_user');
    
    // Remove o token do header
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook Customizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};