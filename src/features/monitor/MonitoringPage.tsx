import { format, isToday, isYesterday } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Bot, Clock, Loader2, MessageSquare, Phone, Search, User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
// ✅ API v2.0: Importando tipo paginado
import { useConversations, useMessages, type Message } from '../../hooks/useMonitoring';



// --- Utilitários de Data ---
function formatDisplayDate(dateString: string) {
  const date = new Date(dateString);
  if (isToday(date)) {
    return format(date, 'HH:mm');
  }
  if (isYesterday(date)) {
    return 'Ontem';
  }
  return format(date, 'dd/MM/yyyy');
}

function formatFullDate(dateString: string) {
  return format(new Date(dateString), "d 'de' MMMM 'às' HH:mm", { locale: ptBR });
}

// Utilitário para limpar telefone na busca (remove (), -, espaços)
const cleanPhone = (phone: string) => phone.replace(/\D/g, '');

export function MonitoringPage() {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Carregar Conversas e Mensagens via Hook
  const { data: conversationsData, isLoading: isLoadingList } = useConversations();
  const { data: messagesData, isLoading: isLoadingChat } = useMessages(selectedCustomerId);

  const conversations = conversationsData || [];
  const messages = messagesData || [];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const selectedCustomer = conversations.find(c => c.id === selectedCustomerId);

  // 3. Lógica de Filtro Aprimorada (Nome ou Telefone)
  const filteredConversations = conversations.filter(c => {
    const search = searchTerm.toLowerCase();
    const cleanSearch = cleanPhone(search);
    
    const matchesName = c.name && c.name.toLowerCase().includes(search);
    const matchesPhone = c.phone.includes(cleanSearch) || c.phone.includes(search);
    
    return matchesName || matchesPhone;
  });

  // 4. Agrupamento de Mensagens por Data
  const groupedMessages = messages.reduce((acc, msg) => {
    const dateKey = format(new Date(msg.createdAt), 'yyyy-MM-dd');
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(msg);
    return acc;
  }, {} as Record<string, Message[]>);

  return (
    <MainLayout title="Monitoramento em Tempo Real">
      <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
        
        {/* --- SIDEBAR: LISTA DE CONVERSAS --- */}
        <div className="w-full md:w-80 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors shrink-0">
          
          {/* Header da Sidebar com Busca */}
          <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 px-1">
              Conversas Recentes
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrar por nome ou telefone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 text-slate-900 dark:text-slate-100 transition-colors"
              />
            </div>
          </div>
          
          {/* Lista de Chats */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {isLoadingList ? (
              <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-400" /></div>
            ) : filteredConversations.length === 0 ? (
               <div className="text-center p-8 text-slate-500 text-sm flex flex-col items-center">
                 <User className="w-8 h-8 opacity-20 mb-2" />
                 Nenhum cliente encontrado.
               </div>
            ) : (
              filteredConversations.map(conv => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedCustomerId(conv.id)}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl transition-all text-left group ${
                    selectedCustomerId === conv.id 
                      ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 shadow-sm' 
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold transition-colors ${
                    selectedCustomerId === conv.id 
                      ? 'bg-cyan-100 dark:bg-cyan-600 text-cyan-700 dark:text-white' 
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 group-hover:bg-slate-300 dark:group-hover:bg-slate-700'
                  }`}>
                    {conv.name ? conv.name.charAt(0).toUpperCase() : <User className="w-5 h-5" />}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <p className={`font-medium truncate text-sm ${
                        selectedCustomerId === conv.id ? 'text-cyan-900 dark:text-cyan-100' : 'text-slate-700 dark:text-slate-200'
                      }`}>
                        {conv.name || conv.phone}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 ml-2">
                        {formatDisplayDate(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate pr-2 h-4">
                      {conv.lastMessage || <span className="italic opacity-50">Nova conversa</span>}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* --- ÁREA DE CHAT (MAIN) --- */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors shadow-sm">
          {selectedCustomerId ? (
            <>
              {/* Header do Chat */}
              <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur z-10">
                 <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-cyan-500/20">
                      {selectedCustomer?.name?.charAt(0) || <User className="w-5 h-5"/>}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-base">
                        {selectedCustomer?.name || 'Cliente sem nome'}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                        <Phone className="w-3 h-3" />
                        <span className="font-mono">{selectedCustomer?.phone}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></span>
                        <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                           Online
                        </span>
                      </div>
                    </div>
                 </div>
                 
                 <div className="flex items-center gap-3">
                    <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-700">
                        <Clock className="w-3 h-3 animate-pulse text-cyan-500" />
                        Sincronização em tempo real
                    </div>
                 </div>
              </div>

              {/* Área de Mensagens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/50 scroll-smooth">
                {isLoadingChat ? (
                  <div className="h-full flex flex-col items-center justify-center gap-3">
                    <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
                    <p className="text-sm text-slate-400">Carregando histórico...</p>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-slate-500 mt-20 flex flex-col items-center">
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                        <MessageSquare className="w-8 h-8 opacity-30" />
                    </div>
                    <p>Início da conversa.</p>
                    <p className="text-xs opacity-70 mt-1">As mensagens trocadas aparecerão aqui.</p>
                  </div>
                ) : (
                  Object.keys(groupedMessages).map(dateKey => (
                    <div key={dateKey}>
                        {/* Separador de Data */}
                        <div className="flex justify-center mb-6 sticky top-0 z-0">
                            <span className="bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] uppercase tracking-wide font-bold px-3 py-1 rounded-full shadow-sm border border-slate-300 dark:border-slate-700">
                                {isToday(new Date(dateKey)) ? 'Hoje' : isYesterday(new Date(dateKey)) ? 'Ontem' : format(new Date(dateKey), 'dd/MM/yyyy')}
                            </span>
                        </div>

                        <div className="space-y-4">
                            {groupedMessages[dateKey].map((msg) => {
                                const isIA = msg.role === 'model';
                                return (
                                <div key={msg.id} className={`flex w-full group ${isIA ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`flex gap-2 max-w-[85%] md:max-w-[70%] ${isIA ? 'flex-row-reverse' : 'flex-row'}`}>
                                    
                                    {/* Avatar da Mensagem */}
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-auto mb-1 shadow-sm transition-transform group-hover:scale-105 ${
                                        isIA 
                                        ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white' 
                                        : 'bg-white dark:bg-slate-800 text-slate-500 border border-slate-200 dark:border-slate-700'
                                    }`}>
                                        {isIA ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                                    </div>

                                    {/* Balão de Mensagem */}
                                    <div 
                                        title={formatFullDate(msg.createdAt)}
                                        className={`p-3 px-4 rounded-2xl text-sm leading-relaxed shadow-sm relative transition-all ${
                                        isIA 
                                        ? 'bg-indigo-600 text-white rounded-br-none shadow-indigo-900/10' 
                                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-none'
                                        }`}
                                    >
                                        <div className="whitespace-pre-wrap break-words">{msg.content}</div>
                                        
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isIA ? 'text-indigo-200' : 'text-slate-400'}`}>
                                            {format(new Date(msg.createdAt), 'HH:mm')}
                                        </div>
                                    </div>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input (Desabilitado - Apenas Monitoramento) */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <div className="relative">
                   <input 
                    disabled 
                    placeholder="Modo espectador: Acompanhe a conversa em tempo real."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3.5 text-sm text-slate-500 cursor-not-allowed opacity-70 pl-10"
                   />
                   <Bot className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
                </div>
              </div>
            </>
          ) : (
             /* Estado Vazio (Placeholder) */
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center bg-slate-50/50 dark:bg-slate-900/50">
                <div className="w-32 h-32 bg-white dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 animate-in zoom-in duration-500">
                  <MessageSquare className="w-14 h-14 opacity-20 text-slate-500" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Central de Monitoramento</h3>
                <p className="max-w-xs text-sm text-slate-500 leading-relaxed">
                    Selecione uma conversa na barra lateral para visualizar o histórico e o atendimento da IA.
                </p>
             </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}