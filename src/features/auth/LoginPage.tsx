import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom'; // <--- 1. Importação necessária
import { Mail, Lock, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const { signIn, user } = useAuth(); // Pega 'user' também para verificar se já está logado
  const navigate = useNavigate(); // <--- 2. Inicializa o hook de navegação
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldError, setFieldError] = useState<'email' | 'password' | null>(null);

  // Se o usuário já estiver logado, manda pro Dashboard automaticamente
  useEffect(() => {
    if (user) {
      navigate('/');
    }
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
      
      // <--- 3. O PULO DO GATO: Redireciona para a Home/Dashboard
      navigate('/'); 

    } catch (err: any) {
      const backendError = err.response?.data;

      if (backendError) {
        if (backendError.code === 'VALIDATION_ERROR') {
           setError(backendError.message || 'Verifique os dados informados.');
        } 
        else if (backendError.code === 'UNAUTHORIZED' || backendError.code === 'RESOURCE_NOT_FOUND') {
           setError('E-mail ou senha incorretos.');
           setFieldError('password');
        }
        else {
           setError(backendError.message || 'Ocorreu um erro no servidor.');
        }
      } else {
        setError('Não foi possível conectar ao servidor. Verifique sua internet.');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-violet-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />

      {/* Main Card */}
      <div className="w-full max-w-md p-8 relative z-10">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
          
          {/* Header */}
          <div className="p-8 text-center border-b border-slate-800/50">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 mb-4 shadow-lg shadow-cyan-500/20">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CodeIA <span className="text-cyan-400">Admin</span></h1>
            <p className="text-slate-400 text-sm mt-2">Entre para gerenciar seus agentes</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-5">
            
            {error && (
              <div className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 ml-1">E-mail</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className={`h-5 w-5 transition-colors ${fieldError === 'email' ? 'text-red-400' : 'text-slate-500 group-focus-within:text-cyan-400'}`} />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border rounded-xl text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-offset-0 transition-all outline-none
                    ${fieldError === 'email' 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-600'
                    }`}
                  placeholder="admin@empresa.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-medium text-slate-300">Senha</label>
                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors">Esqueceu?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className={`h-5 w-5 transition-colors ${fieldError === 'password' ? 'text-red-400' : 'text-slate-500 group-focus-within:text-cyan-400'}`} />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`block w-full pl-10 pr-3 py-2.5 bg-slate-950/50 border rounded-xl text-slate-100 placeholder-slate-600 focus:ring-2 focus:ring-offset-0 transition-all outline-none
                    ${fieldError === 'password' 
                      ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' 
                      : 'border-slate-700 focus:border-cyan-500 focus:ring-cyan-500/20 hover:border-slate-600'
                    }`}
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-xl shadow-lg shadow-cyan-900/20 text-sm font-semibold text-white bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
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
          <div className="px-8 py-4 bg-slate-950/30 border-t border-slate-800/50 text-center">
            <p className="text-xs text-slate-500">
              Não tem uma conta?{' '}
              <a href="/register" className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors">
                Criar conta
              </a>
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-xs mt-8">
          &copy; 2025 CodeIA Inc. Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
}