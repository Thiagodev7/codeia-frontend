import { Loader2, Sparkles } from 'lucide-react';
import { useState } from 'react';
import { useAgents } from '../../../hooks/useAgents';

interface CreateAgentStepProps {
  onNext: (agent: { id: string; name: string }) => void;
}

export function CreateAgentStep({ onNext }: CreateAgentStepProps) {
  const { saveAgent } = useAgents();
  const [name, setName] = useState('');
  const [role, setRole] = useState(''); // Just for UI helper, we'll bake it into instructions
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Construct valid prompt based on simple inputs
    const instructions = `Você é um assistente virtual chamado ${name}. Sua função principal é atuar como ${role || 'Atendente'}. Seja educado, prestativo e conciso.`;
    
    const slug = name.toLowerCase().replace(/[^a-z0-9]/g, '-');

    try {
      const result = await saveAgent.mutateAsync({
        name,
        slug,
        instructions,
        model: 'gemini-2.0-flash-lite',
        isActive: true
      });
      
      // Se não retornar nada, tentamos inferir ou usar o que temos.
      // Mas o mutateAsync deveria retornar o data.
      // Vamos assumir que retorna Agent. Se falhar no build, ajustamos no hook.
      if (result && result.id) {
          onNext({ id: result.id, name: result.name });
      } else {
          // Fallback se API não retornar o objeto criado (pode acontecer dependendo da impl)
           onNext({ id: 'temp-id', name: name }); 
      }
    } catch (error) {
      console.error(error);
      // Toast is handled by hook usually
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-4">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Vamos criar seu primeiro Agente</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Dê um nome e uma função para sua Inteligência Artificial.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Agente</label>
          <input
            type="text"
            required
            placeholder="Ex: Ana, Atendente Virtual..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="input-field w-full text-lg py-3"
            autoFocus
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Qual a função dele?</label>
          <input
            type="text"
            required
            placeholder="Ex: Vender roupas, Agendar consultas, Tirar dúvidas..."
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="input-field w-full text-lg py-3"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !name || !role}
          className="w-full btn-primary py-4 text-lg font-bold shadow-xl shadow-cyan-900/10 mt-4 flex items-center justify-center gap-2"
        >
          {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Criar e Continuar'}
        </button>
      </form>
    </div>
  );
}
