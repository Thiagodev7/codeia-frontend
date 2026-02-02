import { AlertCircle, ArrowRight, Loader2, Lock, Mail } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ThemeToggle } from '../../components/ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export function LoginPage() {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<'email' | 'password' | null>(null);

  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldError(null);
    setIsLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      const { token, user } = response.data;
      signIn(token, user);
      navigate('/'); 
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { code?: string; message?: string } } };
      const backendError = axiosError.response?.data;
      if (backendError) {
        if (backendError.code === 'VALIDATION_ERROR') {
          const msg = backendError.message || 'Dados inválidos.';
          setError(msg);
          toast.error(msg);
        } else if (backendError.code === 'UNAUTHORIZED') {
           setError('Credenciais incorretas.');
           setFieldError('password');
           toast.error('Email ou senha incorretos');
        } else {
          const msg = backendError.message || 'Erro no servidor.';
          setError(msg);
          toast.error(msg);
        }
      } else {
        setError('Sem conexão com o servidor.');
        toast.error('Não foi possível conectar ao servidor');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    // Fundo Principal: Cinza bem claro (slate-50) no Light, Escuro (slate-950) no Dark
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 relative overflow-hidden transition-colors duration-500 ease-in-out">
      
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Efeitos de Fundo (Sutis no Light, Vibrantes no Dark) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-200/40 dark:bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-200/40 dark:bg-violet-500/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Cartão Central */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden transition-all duration-500">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-slate-100 dark:border-slate-800/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight transition-colors">
              CodeIA <span className="text-cyan-600 dark:text-cyan-400">Admin</span>
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">Entre para gerenciar seus agentes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1.5">
              {/* CORRIGIDO: text-slate-700 no light mode para contraste */}
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-1 uppercase tracking-wider">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${fieldError === 'email' ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400'}`} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all ${fieldError === 'email' ? 'border-red-500 focus:ring-red-200' : ''}`} 
                  placeholder="admin@empresa.com"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                {/* CORRIGIDO: text-slate-700 no light mode */}
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Senha</label>
                <a href="#" className="text-xs text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors font-medium">Esqueceu?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${fieldError === 'password' ? 'text-red-500' : 'text-slate-400 dark:text-slate-500 group-focus-within:text-cyan-600 dark:group-focus-within:text-cyan-400'}`} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`w-full bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-700 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 transition-all ${fieldError === 'password' ? 'border-red-500 focus:ring-red-200' : ''}`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-3 px-4 rounded-xl shadow-lg shadow-cyan-500/20 dark:shadow-cyan-900/20 text-sm font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Entrando...
                </>
              ) : (
                <>
                  Acessar Painel
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 py-4 bg-slate-50 dark:bg-slate-950/30 border-t border-slate-100 dark:border-slate-800/50 text-center transition-colors">
            <p className="text-xs text-slate-500">
              Não tem uma conta?{' '}
              <a href="/register" className="text-cyan-600 dark:text-cyan-400 font-bold hover:underline">
                Criar conta
              </a>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-400 dark:text-slate-600 text-xs mt-8 transition-colors">
          &copy; 2025 CodeIA Inc. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}