import { useState, useEffect } from 'react';
import { X, Save, Loader2, Bot } from 'lucide-react';
// CORREÇÃO: Usando 'import type' aqui também
import type { Agent, CreateAgentDTO } from '../../types/agent';

interface AgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateAgentDTO) => Promise<void>;
  initialData?: Agent | null;
}

export function AgentModal({ isOpen, onClose, onSave, initialData }: AgentModalProps) {
  const [formData, setFormData] = useState<CreateAgentDTO>({
    name: '',
    slug: '',
    instructions: '',
    model: 'gemini-2.0-flash-lite'
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          name: initialData.name,
          slug: initialData.slug,
          instructions: initialData.instructions,
          model: initialData.model
        });
      } else {
        setFormData({ name: '', slug: '', instructions: '', model: 'gemini-2.0-flash-lite' });
      }
      setError('');
    }
  }, [isOpen, initialData]);

  const handleNameChange = (val: string) => {
    if (!initialData) {
      const slug = val.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      setFormData(prev => ({ ...prev, name: val, slug }));
    } else {
      setFormData(prev => ({ ...prev, name: val }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao salvar agente. Verifique os dados.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        
        <div className="flex justify-between items-center p-6 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Bot className="w-6 h-6 text-cyan-600" />
            {initialData ? 'Editar Agente' : 'Novo Agente IA'}
          </h2>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto custom-scrollbar">
          <form id="agent-form" onSubmit={handleSubmit} className="space-y-5">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Nome</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Atendente Comercial"
                  value={formData.name}
                  onChange={e => handleNameChange(e.target.value)}
                  className="input-field w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">Slug (Identificador)</label>
                <input
                  type="text"
                  required
                  readOnly={!!initialData}
                  value={formData.slug}
                  onChange={e => setFormData({...formData, slug: e.target.value})}
                  className={`input-field w-full font-mono text-xs ${initialData ? 'opacity-50 cursor-not-allowed' : ''}`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-400 mb-1">
                Instruções (Prompt do Sistema)
              </label>
              <textarea
                required
                rows={10}
                placeholder="Você é um assistente útil..."
                value={formData.instructions}
                onChange={e => setFormData({...formData, instructions: e.target.value})}
                className="input-field w-full font-mono text-sm leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-lg text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
          </form>
        </div>

        <div className="p-6 border-t border-slate-200 dark:border-slate-800 flex justify-end gap-3 bg-slate-50 dark:bg-slate-900/50 rounded-b-2xl">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" form="agent-form" disabled={isLoading} className="btn-primary flex items-center gap-2">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {initialData ? 'Salvar' : 'Criar'}
          </button>
        </div>
      </div>
    </div>
  );
}