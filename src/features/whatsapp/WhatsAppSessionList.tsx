import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Wifi, WifiOff, Loader2, Smartphone, Trash2, Plus, RefreshCw } from 'lucide-react';
import { CreateSessionModal } from './CreateSessionModal';

interface Session {
  id: string;
  sessionName: string;
  status: 'CONNECTED' | 'DISCONNECTED' | 'QRCODE' | 'STARTING';
  qrCode: string | null;
  phoneNumber: string | null;
  agent?: { name: string } | null;
}

export function WhatsAppSessionList() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loadingIds, setLoadingIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Função de Fetch (Polling)
  const fetchSessions = async () => {
    try {
      const res = await api.get('/whatsapp/sessions');
      setSessions(res.data);
    } catch (error) {
      console.error("Erro ao buscar sessões", error);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 3000); // Atualiza a cada 3s para pegar QR Codes novos
    return () => clearInterval(interval);
  }, []);

  // Ações
  const handleStart = async (id: string) => {
    setLoadingIds(prev => [...prev, id]);
    try { await api.post(`/whatsapp/sessions/${id}/start`); fetchSessions(); } catch(e) {}
    setLoadingIds(prev => prev.filter(sid => sid !== id));
  };

  const handleStop = async (id: string) => {
    if(!confirm("Desconectar este número?")) return;
    setLoadingIds(prev => [...prev, id]);
    try { await api.post(`/whatsapp/sessions/${id}/stop`); fetchSessions(); } catch(e) {}
    setLoadingIds(prev => prev.filter(sid => sid !== id));
  };

  const handleDelete = async (id: string) => {
    if(!confirm("Excluir esta sessão permanentemente?")) return;
    try { await api.delete(`/whatsapp/sessions/${id}`); fetchSessions(); } catch(e) {}
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-cyan-500" />
          Conexões WhatsApp
        </h3>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-lg text-sm font-medium transition-colors border border-cyan-500/20"
        >
          <Plus className="w-4 h-4" />
          Nova Sessão
        </button>
      </div>

      {sessions.length === 0 ? (
        <div className="p-8 border border-dashed border-slate-800 rounded-2xl text-center text-slate-500">
          Nenhuma sessão configurada. Adicione um número para começar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sessions.map(session => (
            <div key={session.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-5 relative overflow-hidden group hover:border-slate-700 transition-all">
              
              {/* Header do Card */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-medium text-slate-200">{session.sessionName}</h4>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="text-xs text-slate-500">Agente:</span>
                    <span className="text-xs bg-slate-800 px-1.5 py-0.5 rounded text-slate-300">
                      {session.agent?.name || 'Padrão (Automático)'}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  {/* Botão de Delete */}
                  <button 
                    onClick={() => handleDelete(session.id)}
                    className="p-1.5 text-slate-600 hover:text-red-400 hover:bg-red-500/10 rounded transition-colors"
                    title="Excluir Sessão"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  
                  {/* Badge de Status */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1.5 ${
                    session.status === 'CONNECTED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : session.status === 'QRCODE'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {session.status === 'CONNECTED' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>}
                    {session.status}
                  </span>
                </div>
              </div>

              {/* Corpo do Card */}
              <div className="min-h-[120px] flex flex-col items-center justify-center bg-slate-950/30 rounded-lg border border-slate-800/50 mb-4 p-4">
                {session.status === 'QRCODE' && session.qrCode ? (
                  <div className="text-center animate-in fade-in zoom-in">
                    <img src={session.qrCode} alt="QR" className="w-32 h-32 rounded-lg border-4 border-white mx-auto mb-2" />
                    <p className="text-xs text-amber-400 animate-pulse">Leia o QR Code agora</p>
                  </div>
                ) : session.status === 'CONNECTED' ? (
                  <div className="text-center">
                    <Smartphone className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
                    <p className="text-sm text-slate-300">Conectado com sucesso</p>
                    <p className="text-xs text-slate-500 font-mono mt-1">+{session.phoneNumber}</p>
                  </div>
                ) : session.status === 'STARTING' || loadingIds.includes(session.id) ? (
                  <div className="text-center text-cyan-400">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                    <p className="text-xs">Iniciando motor...</p>
                  </div>
                ) : (
                  <div className="text-center text-slate-600">
                    <WifiOff className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Desconectado</p>
                  </div>
                )}
              </div>

              {/* Ações */}
              {session.status === 'CONNECTED' || session.status === 'QRCODE' ? (
                <button 
                  onClick={() => handleStop(session.id)}
                  disabled={loadingIds.includes(session.id)}
                  className="w-full py-2 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-medium transition-colors"
                >
                  Desconectar
                </button>
              ) : (
                <button 
                  onClick={() => handleStart(session.id)}
                  disabled={loadingIds.includes(session.id)}
                  className="w-full py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cyan-900/20"
                >
                  {loadingIds.includes(session.id) ? 'Aguarde...' : 'Iniciar Conexão'}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <CreateSessionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSuccess={fetchSessions} 
      />
    </div>
  );
}