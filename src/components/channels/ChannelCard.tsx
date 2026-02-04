import { AlertTriangle, Bot, CheckCircle, Loader2, Power, Smartphone, Trash2, WifiOff } from 'lucide-react';
import type { WhatsAppSession } from '../../hooks/useSessions';
import type { Agent } from '../../types/agent';

interface ChannelCardProps {
  session: WhatsAppSession;
  agents: Agent[];
  onStart: (id: string) => void;
  onStop: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateAgent: (sessionId: string, agentId: string) => void;
  isLoadingAction: boolean;
}

export function ChannelCard({
  session,
  agents,
  onStart,
  onStop,
  onDelete,
  onUpdateAgent,
  isLoadingAction
}: ChannelCardProps) {

  const statusMap = {
    CONNECTED: { color: 'emerald', label: 'Online', icon: CheckCircle },
    QRCODE: { color: 'amber', label: 'Escaneie o QR', icon: Smartphone },
    DISCONNECTED: { color: 'slate', label: 'Offline', icon: WifiOff },
    STARTING: { color: 'blue', label: 'Iniciando...', icon: Loader2 },
  };

  const status = statusMap[session.status] || statusMap.DISCONNECTED;

  return (
    <div className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm transition-all hover:shadow-xl hover:border-cyan-500/30 dark:hover:border-cyan-500/30">
      
      {/* Background Glow Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="flex flex-col md:flex-row">
        
        {/* Lado Esquerdo: Status e Informações Principais */}
        <div className="flex-1 p-6 flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border 
                ${session.status === 'CONNECTED' ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' : 
                  session.status === 'QRCODE' ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20' :
                  'bg-slate-100 text-slate-500 border-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
                }`}>
                <span className={`w-2 h-2 rounded-full ${session.status === 'CONNECTED' ? 'bg-emerald-500 animate-pulse' : 'bg-current'}`} />
                {status.label}
              </div>
              
              <button 
                onClick={() => onDelete(session.id)}
                className="text-slate-400 hover:text-red-500 transition-colors p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                title="Excluir canal"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-1 flex items-center gap-2">
              {session.sessionName}
            </h3>
            <p className="text-sm text-slate-500 font-mono mb-6">
              {session.phoneNumber ? `+${session.phoneNumber}` : 'Sem número vinculado'}
            </p>
          </div>

          {/* Área de Ação de Conexão */}
          <div className="mt-auto">
            {session.status === 'QRCODE' && session.qrCode ? (
               <div className="flex flex-col items-center p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800 animate-in fade-in zoom-in">
                  <img src={session.qrCode} alt="QR Code" className="w-40 h-40 rounded-lg mix-blend-multiply dark:mix-blend-normal" />
                  <p className="text-xs text-center mt-3 text-slate-500">Abra o WhatsApp &gt; Aparelhos Conectados &gt; Conectar</p>
               </div>
            ) : (
                <div className="flex items-center gap-4">
                     {session.status === 'CONNECTED' ? (
                        <div className="flex-1 p-4 bg-emerald-50/50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shrink-0">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-200">Sincronizado</p>
                                <p className="text-xs text-emerald-600 dark:text-emerald-400">Pronto para enviar e receber mensagens.</p>
                            </div>
                        </div>
                     ) : (
                         <div className="flex-1 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-500 shrink-0">
                                <WifiOff className="w-5 h-5" />
                            </div>
                            <p className="text-sm text-slate-500">Sessão desconectada.</p>
                         </div>
                     )}

                    <button
                        onClick={() => session.status === 'CONNECTED' ? onStop(session.id) : onStart(session.id)}
                        disabled={isLoadingAction}
                        className={`h-12 w-12 rounded-xl flex items-center justify-center transition-all shadow-lg hover:scale-105 active:scale-95 border
                            ${session.status === 'CONNECTED' 
                                ? 'bg-white text-red-500 border-red-100 hover:bg-red-50 hover:border-red-200 dark:bg-slate-800 dark:text-red-400 dark:border-red-900/30 dark:hover:bg-red-900/20' 
                                : 'bg-cyan-600 text-white border-cyan-500 hover:bg-cyan-500 dark:bg-cyan-600 dark:hover:bg-cyan-500 shadow-cyan-500/20'
                            }`}
                        title={session.status === 'CONNECTED' ? 'Desconectar' : 'Conectar'}
                    >
                         {isLoadingAction ? <Loader2 className="w-5 h-5 animate-spin" /> : <Power className="w-5 h-5" />}
                    </button>
                </div>
            )}
          </div>
        </div>

        {/* Separador Vertical (apenas desktop) */}
        <div className="hidden md:block w-px bg-slate-100 dark:bg-slate-800 my-6" />

        {/* Lado Direito: Inteligência (Agente) */}
        <div className="flex-1 p-6 bg-slate-50/50 dark:bg-slate-950/20 flex flex-col justify-center">
            
            <div className={`p-5 rounded-xl border transition-all duration-300 relative overflow-hidden
                ${session.agent 
                    ? 'bg-white dark:bg-slate-900 border-indigo-100 dark:border-indigo-500/30 text-indigo-900 dark:text-indigo-100 shadow-sm' 
                    : 'bg-white dark:bg-slate-900 border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-100 shadow-sm border-dashed'
                }`}>
                
                {/* Glow decorativo se tiver agente */}
                {session.agent && <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />}

                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className={`p-2 rounded-lg ${session.agent ? 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400' : 'bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400'}`}>
                        {session.agent ? <Bot className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                    </div>
                    <div>
                        <h4 className="font-bold text-sm">Inteligência Artificial</h4>
                        <p className="text-xs opacity-70">
                            {session.agent ? 'Agente Ativo' : 'Atenção Necessária'}
                        </p>
                    </div>
                </div>

                <div className="space-y-2 relative z-10">
                    <label className="text-xs font-semibold uppercase tracking-wider opacity-60">Agente Responsável</label>
                    <div className="relative">
                        <select 
                            className="w-full appearance-none bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg py-2.5 px-3 pr-10 text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-700"
                            value={session.agent?.id || ""} // Agora temos o ID vindo do backend!
                            onChange={(e) => onUpdateAgent(session.id, e.target.value)}
                        >
                            <option value="">🚫 &nbsp; Nenhum (Modo Silencioso)</option>
                            {agents.map(agent => (
                                <option key={agent.id} value={agent.id}>
                                    🤖 &nbsp; {agent.name}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                    </div>
                    
                    {!session.agent && (
                         <p className="text-[10px] text-amber-600 dark:text-amber-400 font-medium mt-2 animate-pulse">
                            ⚠️ Selecione um agente para o bot responder automaticamente.
                        </p>
                    )}
                </div>
            </div>

        </div>

      </div>
    </div>
  );
}
