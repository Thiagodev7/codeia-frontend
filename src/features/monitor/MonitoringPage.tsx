import { useState, useEffect, useRef } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { api } from '../../lib/api';
import { User, Bot, Search, MessageSquare, Clock } from 'lucide-react';

interface Customer {
  id: string;
  name: string | null;
  phone: string;
  _count: { messages: number };
}

interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  createdAt: string;
}

export function MonitoringPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCustomers = () => {
      api.get('/crm/customers').then(res => setCustomers(res.data)).catch(console.error);
    };
    fetchCustomers();
    const interval = setInterval(fetchCustomers, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!selectedCustomerId) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get(`/crm/customers/${selectedCustomerId}/messages`);
        setMessages(res.data);
      } catch (error) {
        console.error("Erro ao carregar mensagens", error);
      }
    };

    setLoadingChat(true);
    fetchMessages().then(() => {
      setLoadingChat(false);
      scrollToBottom();
    });

    const interval = setInterval(() => {
      api.get(`/crm/customers/${selectedCustomerId}/messages`).then(res => {
         setMessages(res.data); 
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedCustomerId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  return (
    <MainLayout title="Monitoramento em Tempo Real">
      <div className="flex h-[calc(100vh-140px)] gap-6 overflow-hidden">
        
        {/* LISTA DE CLIENTES (SIDEBAR) */}
        <div className="w-full md:w-80 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
          <div className="p-4 border-b border-slate-200 dark:border-slate-800">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Buscar cliente..." 
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-cyan-500/50 text-slate-900 dark:text-slate-100 transition-colors"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
            {customers.map(customer => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomerId(customer.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left ${
                  selectedCustomerId === customer.id 
                    ? 'bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 shadow-sm' 
                    : 'hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                  selectedCustomerId === customer.id 
                    ? 'bg-cyan-100 dark:bg-cyan-500 text-cyan-700 dark:text-white' 
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`font-medium truncate ${
                    selectedCustomerId === customer.id 
                      ? 'text-cyan-900 dark:text-cyan-100' 
                      : 'text-slate-700 dark:text-slate-200'
                  }`}>
                    {customer.name || customer.phone}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    {customer._count.messages} mensagens
                  </p>
                </div>
              </button>
            ))}
            
            {customers.length === 0 && (
               <div className="text-center p-8 text-slate-500 text-sm">
                 Nenhum atendimento iniciado.
               </div>
            )}
          </div>
        </div>

        {/* ÁREA DE CHAT (MAIN) */}
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-colors">
          {selectedCustomerId ? (
            <>
              {/* Header do Chat */}
              <div className="h-16 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-600 flex items-center justify-center text-white font-bold">
                      {selectedCustomer?.name?.charAt(0) || <User className="w-5 h-5"/>}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100">{selectedCustomer?.name || 'Cliente Desconhecido'}</h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">{selectedCustomer?.phone}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 dark:bg-slate-800/50 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700">
                    <Clock className="w-3 h-3" />
                    Auto-update ativo
                 </div>
              </div>

              {/* Mensagens */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-slate-950/30">
                {messages.length === 0 && !loadingChat && (
                  <div className="text-center text-slate-500 mt-10">Histórico vazio.</div>
                )}
                
                {messages.map((msg) => {
                  const isModel = msg.role === 'model';
                  return (
                    <div key={msg.id} className={`flex ${isModel ? 'justify-start' : 'justify-end'}`}>
                      <div className={`flex gap-3 max-w-[80%] ${isModel ? 'flex-row' : 'flex-row-reverse'}`}>
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${
                          isModel 
                            ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30' 
                            : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-300'
                        }`}>
                          {isModel ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                        </div>

                        {/* Balão */}
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                          isModel 
                            ? 'bg-white dark:bg-indigo-500/10 border border-slate-200 dark:border-indigo-500/20 text-slate-700 dark:text-slate-200 rounded-tl-none' 
                            : 'bg-cyan-600 text-white rounded-tr-none shadow-cyan-900/20'
                        }`}>
                          {msg.content}
                          <div className={`text-[10px] mt-2 opacity-60 text-right ${isModel ? 'text-slate-400 dark:text-indigo-200' : 'text-cyan-100'}`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
                <div className="relative">
                   <input 
                    disabled 
                    placeholder="Intervenção manual em breve..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-500 cursor-not-allowed"
                   />
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <MessageSquare className="w-16 h-16 opacity-20 mb-4" />
                <p>Selecione uma conversa para monitorar</p>
             </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}