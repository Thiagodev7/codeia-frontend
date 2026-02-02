import { Bot, Plus } from 'lucide-react';
import { useState } from 'react';
import { AgentCard } from '../../components/agents/AgentCard';
import { ChannelCard } from '../../components/channels/ChannelCard';
import { MainLayout } from '../../components/layout/MainLayout';
import { useAgents } from '../../hooks/useAgents';
import { useSessions } from '../../hooks/useSessions';
import type { Agent } from '../../types/agent';
import { AgentModal } from '../agents/AgentModal';
import { CreateSessionModal } from '../whatsapp/CreateSessionModal';

export function ChannelsPage() {
  const { sessions, startSession, stopSession, deleteSession, updateSession, refetch } = useSessions();
  const { agents, saveAgent, toggleAgentStatus, deleteAgent } = useAgents(); // Precisamos da lista de agentes para popular o select

  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isAgentModalOpen, setIsAgentModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);

  // Handlers
  const handleStart = async (id: string) => {
    setLoadingIds(p => [...p, id]);
    try { await startSession.mutateAsync(id); } finally { setLoadingIds(p => p.filter(i => i !== id)); }
  };

  const handleStop = async (id: string) => {
    if(!confirm("Desconectar?")) return;
    setLoadingIds(p => [...p, id]);
    try { await stopSession.mutateAsync(id); } finally { setLoadingIds(p => p.filter(i => i !== id)); }
  };

  const handleDelete = (id: string) => {
    if(confirm("Excluir canal?")) deleteSession.mutate(id);
  };

  const handleUpdateAgent = (sessionId: string, agentId: string) => {
    // Se agentId for vazio, mandamos null para desvincular
    updateSession.mutate({ id: sessionId, agentId: agentId || null });
  };

  return (
    <MainLayout title="Meus Canais">
      <div className="relative space-y-10 animate-in fade-in duration-500 pb-20">
        
        {/* Background Mesh Gradient (Subtle) */}
        <div className="absolute top-0 left-0 right-0 h-[500px] bg-gradient-to-br from-cyan-500/5 via-indigo-500/5 to-transparent blur-3xl pointer-events-none -z-10" />

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Central de Conexões</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-2xl text-lg leading-relaxed">
                    Gerencie seus números do WhatsApp e designe os "Cérebros" (Agentes) que controlarão cada canal de atendimento.
                </p>
            </div>
            
            <button 
                onClick={() => setIsSessionModalOpen(true)}
                className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:-translate-y-0.5"
            >
                <div className="bg-white/20 p-1 rounded-full group-hover:rotate-90 transition-transform">
                    <Plus className="w-4 h-4" />
                </div>
                <span>Novo WhatsApp</span>
            </button>
        </div>

        {/* Lista de Canais */}
        <div className="grid grid-cols-1 gap-6">
            {sessions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50/50 dark:bg-slate-900/50 transition-colors hover:border-cyan-200 dark:hover:border-cyan-900/50">
                     <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-6">
                        <Bot className="w-10 h-10 text-slate-300 dark:text-slate-600" />
                     </div>
                    <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">Comece conectando um WhatsApp</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-center max-w-md mb-8">
                        Para que seus agentes possam conversar, você precisa conectar pelo menos um número de telefone.
                    </p>
                    <button 
                        onClick={() => setIsSessionModalOpen(true)}
                        className="text-cyan-600 font-semibold hover:text-cyan-500 hover:underline flex items-center gap-1"
                    >
                        Conectar agora <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            ) : (
                sessions.map(session => (
                    <ChannelCard 
                        key={session.id}
                        session={session}
                        agents={agents}
                        onStart={handleStart}
                        onStop={handleStop}
                        onDelete={handleDelete}
                        onUpdateAgent={handleUpdateAgent}
                        isLoadingAction={loadingIds.includes(session.id)}
                    />
                ))
            )}
        </div>

        {/* Separator / Divider */}
        <div className="relative py-8">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-slate-200 dark:border-slate-800"></div>
            </div>
            <div className="relative flex justify-center">
                <span className="bg-slate-50 dark:bg-slate-950 px-4 text-sm font-medium text-slate-400 uppercase tracking-widest">Configuração de IA</span>
            </div>
        </div>
      
        {/* SEÇÃO DE AGENTES */}
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                        <span className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                            <Bot className="w-6 h-6" />
                        </span>
                        Meus Agentes
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 mt-2 ml-14">
                        Crie personalidades distintas para diferentes propósitos (Vendas, Suporte, etc).
                    </p>
                </div>
                <button 
                    onClick={() => { setEditingAgent(null); setIsAgentModalOpen(true); }}
                    className="flex items-center gap-2 px-4 py-2 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-900/20 rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" /> Novo Agente
                </button>
            </div>

            {agents.length === 0 ? (
                 <div className="p-12 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm text-center">
                    <p className="text-slate-500 font-medium mb-4">Você ainda não tem nenhum cérebro criado.</p>
                    <button 
                        onClick={() => { setEditingAgent(null); setIsAgentModalOpen(true); }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-500/20"
                    >
                        Criar meu primeiro agente
                    </button>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map(agent => (
                        <AgentCard 
                            key={agent.id}
                            agent={agent}
                            onToggleStatus={(a) => toggleAgentStatus.mutate({ id: a.id, isActive: !a.isActive })}
                            onEdit={(a) => { setEditingAgent(a); setIsAgentModalOpen(true); }}
                            onDelete={(id) => { if(confirm("Remover agente?")) deleteAgent.mutate(id); }}
                        />
                    ))}
                    
                    {/* Card de "Novo Agente" Ghost */}
                    <button
                        onClick={() => { setEditingAgent(null); setIsAgentModalOpen(true); }}
                        className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all group min-h-[180px]"
                    >
                        <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-slate-400 group-hover:text-indigo-500">
                             <Plus className="w-6 h-6" />
                        </div>
                        <span className="font-semibold text-slate-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">Criar Novo Agente</span>
                    </button>
                </div>
            )}
        </div>

        {/* Modais */}
        <CreateSessionModal 
            isOpen={isSessionModalOpen}
            onClose={() => setIsSessionModalOpen(false)}
            onSuccess={() => refetch()}
        />

        <AgentModal 
            isOpen={isAgentModalOpen}
            onClose={() => setIsAgentModalOpen(false)}
            onSave={async (data) => {
                const payload = editingAgent ? { ...data, id: editingAgent.id } : data;
                await saveAgent.mutateAsync(payload);
                setIsAgentModalOpen(false);
                setEditingAgent(null);
            }}
            initialData={editingAgent}
        />

      </div>
    </MainLayout>
  );
}
