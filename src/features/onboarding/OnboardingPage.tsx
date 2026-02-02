import { Bot, Check, ChevronRight, Smartphone } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '../../components/layout/MainLayout';
import { ConnectStep } from './steps/ConnectStep';
import { CreateAgentStep } from './steps/CreateAgentStep';

export type OnboardingData = {
  agentId?: string;
  agentName?: string;
  sessionId?: string;
};

export function OnboardingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [data, setData] = useState<OnboardingData>({});
  const navigate = useNavigate();

  const nextStep = () => setStep(prev => (prev < 3 ? prev + 1 : prev) as 1 | 2 | 3);

  const handleFinish = () => {
    navigate('/');
  };

  return (
    <MainLayout title="Configuração Inicial">
      <div className="max-w-3xl mx-auto py-8">
        
        {/* Progress Bar */}
        <div className="mb-12 relative">
          <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-200 dark:bg-slate-800 -z-10 rounded-full"></div>
          <div 
            className="absolute top-1/2 left-0 h-1 bg-cyan-500 transition-all duration-500 rounded-full"
            style={{ width: step === 1 ? '0%' : step === 2 ? '50%' : '100%' }}
          ></div>
          
          <div className="flex justify-between">
            {/* Step 1 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 1 
                  ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-900/20 scale-110' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
                {step > 1 ? <Check className="w-6 h-6" /> : <Bot className="w-5 h-5" />}
              </div>
              <span className={`text-sm font-medium ${step >= 1 ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}>
                Criar Agente
              </span>
            </div>

            {/* Step 2 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 2 
                  ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-900/20 scale-110' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
                {step > 2 ? <Check className="w-6 h-6" /> : <Smartphone className="w-5 h-5" />}
              </div>
              <span className={`text-sm font-medium ${step >= 2 ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}>
                Conectar WhatsApp
              </span>
            </div>

            {/* Step 3 */}
            <div className="flex flex-col items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                step >= 3 
                  ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-900/20 scale-110' 
                  : 'bg-white dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-400'
              }`}>
                <Check className="w-6 h-6" />
              </div>
              <span className={`text-sm font-medium ${step >= 3 ? 'text-cyan-700 dark:text-cyan-400' : 'text-slate-500'}`}>
                Concluído
              </span>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {step === 1 && (
            <CreateAgentStep 
              onNext={(agentData) => {
                setData(prev => ({ ...prev, agentId: agentData.id, agentName: agentData.name }));
                nextStep();
              }} 
            />
          )}

          {step === 2 && (
            <ConnectStep 
              agentId={data.agentId}
              agentName={data.agentName}
              onNext={() => nextStep()}
            />
          )}

          {step === 3 && (
             <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xl">
               <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in spin-in-12 duration-700">
                 <Check className="w-10 h-10" />
               </div>
               <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Tudo Configurado!</h2>
               <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-8">
                 Seu agente <strong>{data.agentName}</strong> já está ativo e pronto para atender clientes no WhatsApp conectado.
               </p>
               <button 
                 onClick={handleFinish}
                 className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-cyan-900/20 transition-all hover:scale-105 flex items-center gap-2 mx-auto"
               >
                 Ir para o Dashboard <ChevronRight />
               </button>
             </div>
          )}
        </div>

      </div>
    </MainLayout>
  );
}
