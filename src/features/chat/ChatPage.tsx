import { useState, useEffect, useRef } from 'react';
import { Send, Bot, Trash2, Loader2, MessageSquare, AlertCircle, ArrowLeft, MoreVertical } from 'lucide-react';
import { api } from '../../lib/api';
import { MainLayout } from '../../components/layout/MainLayout';
import type { Agent } from '../../types/agent';

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: Date;
}

export default function ChatPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [isLoadingAgents, setIsLoadingAgents] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchAgents();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoadingResponse]);

  // Foca no input ao entrar no chat (apenas desktop para não abrir teclado no mobile à força)
  useEffect(() => {
    if (selectedAgentId && window.innerWidth > 768) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [selectedAgentId]);

  const fetchAgents = async () => {
    try {
      const { data } = await api.get<Agent[]>('/agents');
      setAgents(data);
    } catch (error) {
      console.error('Erro ao buscar agentes', error);
    } finally {
      setIsLoadingAgents(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || !selectedAgentId || isLoadingResponse) return;

    const currentInput = input;
    setInput('');

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: currentInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoadingResponse(true);

    try {
      const { data } = await api.post('/chat', {
        agentId: selectedAgentId,
        message: currentInput
      });

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.response || "O agente não retornou resposta.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: "❌ Erro ao comunicar com a IA.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const clearChat = () => setMessages([]);

  const selectedAgent = agents.find(a => a.id === selectedAgentId);

  return (
    <MainLayout title="Simulador de IA">
      {/* Container Principal */}
      <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-9rem)] overflow-hidden gap-6 relative">
        
        {/* --- COLUNA ESQUERDA (LISTA) --- 
            Lógica Mobile: Se tem agente selecionado, esconde a lista (hidden). 
            Se não tem, mostra (flex).
            Desktop: Sempre mostra (md:flex).
        */}
        <div className={`w-full md:w-80 flex-col gap-4 shrink-0 h-full transition-all duration-300 ${selectedAgentId ? 'hidden md:flex' : 'flex'}`}>
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm h-full flex flex-col overflow-hidden">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-4 px-2">
              Seus Agentes
            </h2>

            {isLoadingAgents ? (
              <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-cyan-600" /></div>
            ) : agents.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-sm text-slate-500">Nenhum agente disponível.</p>
              </div>
            ) : (
              <div className="space-y-2 overflow-y-auto custom-scrollbar flex-1 pr-1">
                {agents.map(agent => (
                  <button
                    key={agent.id}
                    onClick={() => { setSelectedAgentId(agent.id); clearChat(); }}
                    className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${
                      selectedAgentId === agent.id
                        ? 'bg-cyan-50 border-cyan-200 dark:bg-cyan-900/20 dark:border-cyan-800 shadow-sm'
                        : 'bg-transparent border-transparent hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-50 dark:border-slate-800/50'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                        <span className={`font-semibold text-sm ${selectedAgentId === agent.id ? 'text-cyan-900 dark:text-cyan-100' : 'text-slate-700 dark:text-slate-200'}`}>
                            {agent.name}
                        </span>
                        {agent.isActive && <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-500/50" />}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono truncate opacity-80">
                        {agent.slug}
                    </div>
                    {/* Seta indicativa no Mobile */}
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 md:hidden">
                        👉
                    </div>
                  </button>
                ))}
              </div>
            )}
            
            {/* Contexto do Prompt (Desktop Only) */}
            {selectedAgent && (
              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 hidden md:flex flex-col gap-2 shrink-0">
                <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <AlertCircle className="w-3 h-3" />
                    <span>Prompt Ativo</span>
                </div>
                <div className="text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-100 dark:border-slate-800 max-h-32 overflow-y-auto font-mono custom-scrollbar line-clamp-4 hover:line-clamp-none transition-all">
                  {selectedAgent.instructions}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- COLUNA DIREITA (CHAT) --- 
            Lógica Mobile: Se NÃO tem agente, esconde o chat (hidden).
            Se tem, mostra (flex).
            Desktop: Sempre mostra (md:flex).
        */}
        <div className={`flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex-col overflow-hidden relative h-full ${!selectedAgentId ? 'hidden md:flex' : 'flex'}`}>
          
          {/* Header Responsivo */}
          <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center px-4 md:px-6 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm shrink-0 z-10">
            <div className="flex items-center gap-3 overflow-hidden">
              
              {/* Botão Voltar (Mobile Only) */}
              <button 
                onClick={() => setSelectedAgentId(null)}
                className="md:hidden p-2 -ml-2 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>

              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selectedAgent ? 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' : 'bg-slate-100 text-slate-400 dark:bg-slate-800'}`}>
                <Bot className="w-6 h-6" />
              </div>
              
              <div className="min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm md:text-base truncate leading-tight">
                  {selectedAgent ? selectedAgent.name : 'Selecione um Agente'}
                </h3>
                <p className="text-xs text-slate-500 truncate">
                  {selectedAgent ? 'Ambiente de Teste' : 'Aguardando...'}
                </p>
              </div>
            </div>
            
            {messages.length > 0 && (
                <button 
                onClick={clearChat} 
                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                title="Limpar Conversa"
                >
                <Trash2 className="w-5 h-5" />
                </button>
            )}
          </div>

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-slate-50/50 dark:bg-black/20">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 opacity-60">
                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8" />
                </div>
                <p className="font-medium text-sm">Inicie a conversa</p>
                <p className="text-xs mt-1 text-center max-w-[200px]">Envie uma mensagem para testar as instruções do agente.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-4 py-3 shadow-sm relative group ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-br from-cyan-600 to-blue-600 text-white rounded-br-none' 
                      : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'
                  }`}>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 text-right font-medium opacity-70 ${msg.role === 'user' ? 'text-cyan-100' : 'text-slate-400'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
            
            {isLoadingResponse && (
              <div className="flex justify-start animate-in fade-in">
                <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-600" />
                  <span className="text-xs text-slate-500 font-medium">Digitando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shrink-0">
            <form onSubmit={handleSendMessage} className="relative flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={selectedAgent ? "Digite sua mensagem..." : "Selecione um agente"}
                disabled={!selectedAgent || isLoadingResponse}
                className="w-full bg-slate-100 dark:bg-slate-800 border-0 rounded-xl px-4 py-3 pr-12 text-slate-900 dark:text-white placeholder:text-slate-500 focus:ring-2 focus:ring-cyan-500 transition-all disabled:opacity-50 text-sm md:text-base"
              />
              <button
                type="submit"
                disabled={!input.trim() || !selectedAgent || isLoadingResponse}
                className="absolute right-2 p-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-all disabled:opacity-0 disabled:scale-90 shadow-sm"
              >
                <Send className="w-4 h-4 md:w-5 md:h-5" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </MainLayout>
  );
}