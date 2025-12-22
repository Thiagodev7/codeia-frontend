import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });
  
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await api.post('/login', data);
      signIn(response.data.token, response.data.user);
      navigate('/'); 
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
            CodeIA
          </h1>
          <p className="text-slate-400 mt-2">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input 
                {...register('email')}
                type="email" 
                placeholder="E-mail" 
                className="input-field pl-10"
              />
            </div>
            {errors.email && <span className="text-xs text-red-500 ml-1">{errors.email.message}</span>}
          </div>

          <div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500" />
              <input 
                {...register('password')}
                type="password" 
                placeholder="Senha" 
                className="input-field pl-10"
              />
            </div>
            {errors.password && <span className="text-xs text-red-500 ml-1">{errors.password.message}</span>}
          </div>

          {errorMessage && (
            <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
              {errorMessage}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}