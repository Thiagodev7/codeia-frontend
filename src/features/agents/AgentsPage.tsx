import { Bot, Edit2, Loader2, Pause, Play, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import type { Agent, CreateAgentDTO } from '../../types/agent';
import { AgentModal } from './AgentModal';
// [1] Importar o Layout Principal
import { toast } from 'sonner';
import { MainLayout } from '../../components/layout/MainLayout';

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);

  const fetchAgents = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get<Agent[]>('/agents');
      setAgents(data);
    } catch (error) {
      console.error("Erro ao buscar agentes", error);
      toast.error('Erro ao buscar lista de agentes');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleSave = async (data: CreateAgentDTO) => {
    try {
      if (editingAgent) {
        await api.put(`/agents/${editingAgent.id}`, data);
      } else {
        await api.post('/agents', data);
      }
      await fetchAgents();
    } catch (error) {
      console.error("Erro ao salvar agente", error);
      // O erro já é tratado no modal, mas garantimos aqui também
      toast.error('Erro ao salvar agente');
      throw error; 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja remover este agente?")) return;
    try {
      await api.delete(`/agents/${id}`);
      setAgents(prev => prev.filter(a => a.id !== id));
    } catch (error) {
      console.error("Erro ao deletar agente", error);
      toast.error('Erro ao remover agente');
    }
  };

  const handleToggleStatus = async (agent: Agent) => {
    try {
      setAgents(prev => prev.map(a => 
        a.id === agent.id ? { ...a, isActive: !a.isActive } : a
      ));
      
      await api.put(`/agents/${agent.id}`, { isActive: !agent.isActive });
    } catch (error) {
      console.error("Erro ao alternar status do agente", error);
      toast.error('Erro ao atualizar status do agente');
      fetchAgents();
    }
  };

  return (
    // [2] Envolver tudo no MainLayout
    <MainLayout title="Agentes de IA">
      <div className="space-y-6 animate-in fade-in duration-500">
        
        {/* Header da Página */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Bot className="w-6 h-6 text-cyan-600 dark:text-cyan-500" />
              Agentes de IA
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Gerencie as personalidades e instruções dos seus assistentes.
            </p>
          </div>
          
          <button 
            onClick={() => { setEditingAgent(null); setIsModalOpen(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-sm font-medium transition-all shadow-lg shadow-cyan-900/20"
          >
            <Plus className="w-4 h-4" />
            Novo Agente
          </button>
        </div>

        {/* Loading e Lista (conteúdo igual ao anterior) */}
        {isLoading && agents.length === 0 ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
          </div>
        ) : agents.length === 0 ? (
          <div className="p-12 border border-dashed border-slate-300 dark:border-slate-800 rounded-2xl text-center text-slate-500 bg-slate-50/50 dark:bg-slate-900/50">
            <Bot className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
            <p>Nenhum agente configurado.</p>
            <p className="text-sm mt-1">Crie seu primeiro assistente virtual para começar.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {agents.map(agent => (
              <div key={agent.id} className="bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-5 relative group hover:border-cyan-200 dark:hover:border-cyan-900/50 transition-all shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-lg">{agent.name}</h4>
                    <span className="text-xs font-mono text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded mt-1 inline-block">
                      {agent.slug}
                    </span>
                  </div>
                  
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                    agent.isActive 
                      ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20' 
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-700'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`}></span>
                    {agent.isActive ? 'ATIVO' : 'PAUSADO'}
                  </span>
                </div>

                <div className="bg-slate-50 dark:bg-slate-950/50 rounded-lg p-3 mb-4 h-28 overflow-hidden relative border border-slate-100 dark:border-slate-800/50">
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-mono leading-relaxed whitespace-pre-wrap">
                    {agent.instructions}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-slate-50 dark:from-slate-950/50 to-transparent" />
                </div>

                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                  <button
                    onClick={() => handleToggleStatus(agent)}
                    className={`flex-1 py-1.5 rounded text-xs font-medium border flex items-center justify-center gap-1.5 transition-colors ${
                      agent.isActive 
                      ? 'border-amber-200 text-amber-700 hover:bg-amber-50 dark:border-amber-900/30 dark:text-amber-500 dark:hover:bg-amber-900/20'
                      : 'border-emerald-200 text-emerald-700 hover:bg-emerald-50 dark:border-emerald-900/30 dark:text-emerald-500 dark:hover:bg-emerald-900/20'
                    }`}
                  >
                    {agent.isActive ? <><Pause className="w-3 h-3" /> Pausar</> : <><Play className="w-3 h-3" /> Ativar</>}
                  </button>

                  <button 
                    onClick={() => { setEditingAgent(agent); setIsModalOpen(true); }}
                    className="p-2 text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/20 rounded transition-colors"
                    title="Editar"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  
                  <button 
                    onClick={() => handleDelete(agent.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <AgentModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          initialData={editingAgent}
        />
      </div>
    </MainLayout>
  );
}