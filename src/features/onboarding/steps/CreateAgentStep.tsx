import { Check, Loader2, Sparkles, User, Wand2 } from 'lucide-react';
import { useState } from 'react';
import { AGENT_TEMPLATES, type AgentTemplate } from '../../../data/agentTemplates';
import { useAgents } from '../../../hooks/useAgents';

interface CreateAgentStepProps {
  onNext: (agent: { id: string; name: string }) => void;
}

export function CreateAgentStep({ onNext }: CreateAgentStepProps) {
  const { saveAgent } = useAgents();
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('secretary');
  const [name, setName] = useState('');
  const [role, setRole] = useState('Agendamento e Triagem'); 
  const [loading, setLoading] = useState(false);

  // Auto-fill role/instructions but PROTECT user's name
  const handleTemplateSelect = (template: AgentTemplate) => {
    setSelectedTemplateId(template.id);
    if (template.id !== 'custom') {
        setRole(template.role);
    } else {
        setRole('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Determine instructions based on selected template + user inputs
    let instructions = '';
    const template = AGENT_TEMPLATES.find(t => t.id === selectedTemplateId);
    
    if (template && template.id !== 'custom') {
        instructions = template.instructions;
    } else {
        // Fallback or Custom prompt generator
        instructions = `Você é um assistente virtual chamado ${name}. Sua função principal é atuar como ${role || 'Atendente'}. Seja educado, prestativo e conciso.`;
    }
    
    const slug = name.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');

    try {
      const result = await saveAgent.mutateAsync({
        name,
        slug,
        instructions,
        model: 'gemini-2.0-flash-lite',
        isActive: true
      });
      
      if (result && result.id) {
          onNext({ id: result.id, name: result.name });
      } else {
           onNext({ id: 'temp-id', name: name }); 
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm max-w-2xl mx-auto">
      <div className="mb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 mb-4 shadow-sm ring-1 ring-cyan-100 dark:ring-cyan-900">
          <Sparkles className="w-8 h-8" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Crie seu Agente</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2 text-lg">Dê uma identidade e escolha a personalidade dele.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* 1. Nome (Identidade) */}
        <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                1. Nome do Agente
            </label>
            <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-6 w-6 text-slate-400 group-focus-within:text-cyan-500 transition-colors" />
                </div>
                <input
                    type="text"
                    required
                    placeholder="Ex: Ana, João, Atendente..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl text-xl font-medium focus:border-cyan-500 focus:ring-cyan-500 transition-all placeholder:text-slate-400"
                    autoFocus
                />
            </div>
        </div>

        {/* 2. Personalidade (Templates) */}
        <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-2">
                2. Personalidade & Função <Wand2 className="w-4 h-4 text-purple-500" />
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AGENT_TEMPLATES.map((template) => (
                    <button
                        type="button"
                        key={template.id}
                        onClick={() => handleTemplateSelect(template)}
                        className={`relative group flex flex-col items-start text-left p-5 rounded-xl border-2 transition-all duration-200 hover:shadow-md ${
                            selectedTemplateId === template.id
                            ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-900/10 ring-1 ring-cyan-500/20'
                            : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-800/50 hover:border-cyan-200 dark:hover:border-cyan-800'
                        }`}
                    >
                        <div className="flex items-center justify-between w-full mb-3">
                            <div className={`p-2.5 rounded-lg transition-colors ${
                                selectedTemplateId === template.id 
                                ? 'bg-cyan-100 dark:bg-cyan-500/20 text-cyan-600 dark:text-cyan-400' 
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-cyan-50 dark:group-hover:bg-slate-700'
                            }`}>
                                <template.icon className="w-6 h-6" />
                            </div>
                            {selectedTemplateId === template.id && (
                                <div className="text-cyan-600 dark:text-cyan-400 animate-in zoom-in spin-in-12 duration-300">
                                    <Check className="w-6 h-6" />
                                </div>
                            )}
                        </div>
                        
                        <h3 className={`font-bold text-lg mb-1 transition-colors ${
                            selectedTemplateId === template.id ? 'text-cyan-900 dark:text-cyan-100' : 'text-slate-700 dark:text-slate-200'
                        }`}>
                            {template.name}
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 leading-snug">
                            {template.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>

        {/* 3. Função Detalhada (Opcional/Editável) */}
        <div className="space-y-4 pt-2">
            <label className="block text-sm font-medium text-slate-600 dark:text-slate-400">
                Título do Cargo (Público)
            </label>
            <input
                type="text"
                required
                placeholder="Ex: Agendamento e Triagem"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-field w-full"
            />
            <p className="text-xs text-slate-400">Isso ajuda a IA a entender o contexto da conversa.</p>
        </div>

        <div className="pt-6">
            <button
            type="submit"
            disabled={loading || !name || !role}
            className="w-full btn-primary py-4 text-lg font-bold shadow-xl shadow-cyan-900/10 hover:shadow-cyan-900/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3"
            >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                <>
                    Criar Agente
                    <Sparkles className="w-5 h-5 opacity-50" />
                </>
            )}
            </button>
        </div>

      </form>
    </div>
  );
}
