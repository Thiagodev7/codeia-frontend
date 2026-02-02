import { useQuery } from '@tanstack/react-query';
import { CheckCircle, Loader2, QrCode, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { api } from '../../../lib/api';

interface ConnectStepProps {
  agentId?: string;
  agentName?: string;
  onNext: () => void;
}

export function ConnectStep({ agentId, agentName, onNext }: ConnectStepProps) {
  const [sessionName, setSessionName] = useState('WhatsApp Principal');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'CREATING' | 'QRCODE' | 'CONNECTED'>('IDLE');
  
  // Polling para verificar status da sessão
  useQuery({
    queryKey: ['session-status', sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const res = await api.get(`/whatsapp/sessions`); // Idealmente seria /sessions/:id
      // Como não temos endpoint de detalhe simples sem auth especial as vezes, usamos list
      // Mas assumindo que API retorna lista
      const session = res.data.find((s: { id: string }) => s.id === sessionId);
      
      if (session) {
        if (session.qrCode) setQrCode(session.qrCode);
        if (session.status === 'CONNECTED') {
          setStatus('CONNECTED');
          setTimeout(onNext, 2000); // Avança automático após 2s de sucesso
        } else if (session.status === 'QRCODE') {
          setStatus('QRCODE');
        }
      }
      return session;
    },
    enabled: !!sessionId && status !== 'CONNECTED',
    refetchInterval: 2000, // Poll a cada 2s
  });

  const handleConnect = async () => {
    setStatus('CREATING');
    try {
      const res = await api.post('/whatsapp/sessions', {
        sessionName,
        agentId
      });
      setSessionId(res.data.id);
      
      // Inicia a sessão imediatamente para gerar QR
      await api.post(`/whatsapp/sessions/${res.data.id}/start`);
      // O Polling vai pegar o QR Code assim que sair de STARTING para QRCODE
    } catch (error) {
      console.error(error);
      setStatus('IDLE');
      alert('Erro ao criar sessão. Tente novamente.');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm text-center">
      <div className="mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mb-4">
          <QrCode className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Conectar WhatsApp</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">
          Vamos conectar seu número para o agente <strong>{agentName}</strong> responder.
        </p>
      </div>

      {status === 'IDLE' && (
        <div className="max-w-xs mx-auto space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1 text-left">Nome da Conexão</label>
            <input
              type="text"
              value={sessionName}
              onChange={e => setSessionName(e.target.value)}
              className="input-field w-full"
            />
          </div>
          <button 
            onClick={handleConnect}
            className="w-full btn-primary py-3 flex items-center justify-center gap-2"
          >
            <Smartphone className="w-4 h-4" />
            Gerar QR Code
          </button>
        </div>
      )}

      {status === 'CREATING' && (
        <div className="py-12">
          <Loader2 className="w-10 h-10 animate-spin text-cyan-500 mx-auto mb-4" />
          <p className="text-slate-600 dark:text-slate-300">Iniciando conexão...</p>
        </div>
      )}

      {status === 'QRCODE' && qrCode && (
        <div className="animate-in zoom-in fade-in duration-300">
           <div className="bg-white p-4 rounded-xl border-2 border-slate-200 inline-block mb-4 shadow-inner">
             <img src={qrCode} alt="WhatsApp QR Code" className="w-64 h-64" />
           </div>
           <p className="text-slate-600 dark:text-slate-300 font-medium animate-pulse">
             Abra seu WhatsApp {'>'} Aparelhos Conectados {'>'} Conectar
           </p>
        </div>
      )}

      {status === 'CONNECTED' && (
        <div className="py-8 animate-in zoom-in duration-300">
          <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-emerald-600">WhatsApp Conectado!</h3>
          <p className="text-slate-500">Redirecionando...</p>
        </div>
      )}
    </div>
  );
}
