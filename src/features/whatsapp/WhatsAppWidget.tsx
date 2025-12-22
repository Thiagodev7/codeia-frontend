import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { Wifi, WifiOff, Loader2, Smartphone } from 'lucide-react';

interface WhatsAppStatus {
  status: 'CONNECTED' | 'DISCONNECTED' | 'QRCODE' | 'STARTING';
  qrCode: string | null;
  phoneNumber: string | null;
}

export function WhatsAppWidget() {
  const [data, setData] = useState<WhatsAppStatus | null>(null);
  const [loadingAction, setLoadingAction] = useState(false);

  // Polling para verificar status a cada 3 segundos
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await api.get('/whatsapp/status');
        setData(res.data);
      } catch (error) {
        console.error("Erro ao buscar status do WhatsApp", error);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleConnect = async () => {
    setLoadingAction(true);
    try { await api.post('/whatsapp/connect'); } catch(e) {}
    setLoadingAction(false);
  };

  const handleDisconnect = async () => {
    if(!confirm("Tem certeza que deseja desconectar?")) return;
    setLoadingAction(true);
    try { await api.post('/whatsapp/disconnect'); } catch(e) {}
    setLoadingAction(false);
  };

  if (!data) return <div className="animate-pulse h-48 bg-slate-900 rounded-xl"></div>;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center relative overflow-hidden group hover:border-slate-700 transition-all">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-600 opacity-20 group-hover:opacity-100 transition-opacity"></div>
      
      <div className="flex w-full justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100">WhatsApp</h3>
          <p className="text-sm text-slate-500">Status da conexão</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
          data.status === 'CONNECTED' 
            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
            : 'bg-red-500/10 text-red-400 border-red-500/20'
        }`}>
          {data.status === 'CONNECTED' ? 'ONLINE' : 'OFFLINE'}
        </span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center w-full min-h-[160px]">
        {data.status === 'QRCODE' && data.qrCode ? (
          <div className="text-center animate-in fade-in zoom-in duration-300">
            <img src={data.qrCode} alt="QR Code" className="w-40 h-40 rounded-lg border-4 border-white mb-2" />
            <span className="text-xs text-slate-400 animate-pulse">Escaneie com seu celular</span>
          </div>
        ) : data.status === 'CONNECTED' ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-3 text-emerald-500">
              <Smartphone className="w-8 h-8" />
            </div>
            <p className="text-slate-300 font-medium">Conectado</p>
            <p className="text-sm text-slate-500 font-mono">+{data.phoneNumber}</p>
          </div>
        ) : (
          <div className="text-center text-slate-500">
             <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3">
              <WifiOff className="w-8 h-8 opacity-50" />
            </div>
            <p>Sessão desconectada</p>
          </div>
        )}
      </div>

      <div className="w-full mt-6">
        {data.status === 'CONNECTED' ? (
          <button 
            onClick={handleDisconnect}
            disabled={loadingAction}
            className="w-full py-2 px-4 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors flex items-center justify-center gap-2"
          >
            {loadingAction ? <Loader2 className="animate-spin w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
            Desconectar
          </button>
        ) : (
          <button 
            onClick={handleConnect}
            disabled={loadingAction || data.status === 'QRCODE'}
            className="btn-primary flex items-center justify-center gap-2"
          >
            {loadingAction ? <Loader2 className="animate-spin w-4 h-4" /> : <Wifi className="w-4 h-4" />}
            {data.status === 'QRCODE' ? 'Aguardando Leitura...' : 'Conectar Sessão'}
          </button>
        )}
      </div>
    </div>
  );
}