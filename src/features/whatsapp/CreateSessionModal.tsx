import { Loader2, Save, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '../../lib/api';

interface Agent {
  id: string;
  name: string;
}

interface CreateSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSessionModal({ isOpen, onClose, onSuccess }: CreateSessionModalProps) {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      api.get('/agents').then(res => setAgents(res.data)).catch(console.error);
      setName('');
      setSelectedAgent('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await api.post('/whatsapp/sessions', {
        sessionName: name,
        agentId: selectedAgent || undefined
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const msg = axiosError.response?.data?.message || 'Erro ao criar sessão.';
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {/* Container do Modal */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 transition-colors">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">Nova Conexão WhatsApp</h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Nome da Sessão</label>
            <input
              type="text"
              required
              placeholder="Ex: Vendas - Filial 1"
              value={name}
              onChange={e => setName(e.target.value)}
              className="input-field" // Já estilizado no index.css para temas
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Agente Responsável (IA)</label>
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
              className="input-field appearance-none"
            >
              <option value="">-- Selecione um Agente (Opcional) --</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>
                  🤖 {agent.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-slate-500 mt-1">Quem responderá as mensagens neste número.</p>
          </div>

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-auto flex items-center gap-2"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Criar Sessão
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}