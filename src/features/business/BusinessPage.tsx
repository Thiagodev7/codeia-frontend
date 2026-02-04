import {
    BellRing,
    BrainCircuit,
    Clock,
    Loader2,
    Lock,
    MapPin,
    Save,
    Store,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { MainLayout } from '../../components/layout/MainLayout';
import { api } from '../../lib/api';

const DAYS_CONFIG = [
  { index: 1, label: 'Segunda-feira' },
  { index: 2, label: 'Terça-feira' },
  { index: 3, label: 'Quarta-feira' },
  { index: 4, label: 'Quinta-feira' },
  { index: 5, label: 'Sexta-feira' },
  { index: 6, label: 'Sábado' },
  { index: 0, label: 'Domingo' },
];

interface BusinessHour {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  isOpen: boolean;
}

// Interface para as configurações do tenant
interface BusinessSettings {
  reminderEnabled: boolean;
  reminderMinutes: number;
  businessName?: string;
  contactPhone?: string;
  address?: string;
  website?: string;
  description?: string;
  logoUrl?: string | null;
  businessHours?: BusinessHour[];
  aiKnowledge?: string; // New field
}

export function BusinessPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados de Dados
  const [settings, setSettings] = useState<BusinessSettings>({
    reminderEnabled: false,
    reminderMinutes: 60
  });
  
  
  const [hours, setHours] = useState<BusinessHour[]>([]);
  const [currentPlan, setCurrentPlan] = useState('FREE'); 

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      // ✅ Agora buscamos também os dados do Tenant (/tenant/me) para saber o plano
      const [settingsRes, tenantRes] = await Promise.all([
        api.get('/settings/tenant'),
        api.get('/tenant/me').catch(() => ({ data: { plan: 'FREE' } }))
      ]);

      setSettings(settingsRes.data);
      setCurrentPlan(tenantRes.data.plan || 'FREE'); // ✅ Guarda o plano

      const dbHours: BusinessHour[] = settingsRes.data.businessHours || [];
      const initializedHours = DAYS_CONFIG.map(d => {
        const found = dbHours.find(h => h.dayOfWeek === d.index);
        return found || { dayOfWeek: d.index, startTime: '09:00', endTime: '18:00', isOpen: d.index !== 0 };
      });
      setHours(initializedHours);

    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      toast.error('Erro ao carregar informações da empresa');
    } finally {
      setIsLoading(false);
    }
  }

  // ✅ Helper para verificar permissão
  const isPlanEligible = () => {
    const plan = currentPlan.toUpperCase();
    return ['SECONDARY', 'THIRD', 'UNLIMITED'].includes(plan);
  };

  const updateHour = (dayIndex: number, field: keyof BusinessHour, value: string | boolean) => {
    const newHours = [...hours];
    const targetIndex = newHours.findIndex(h => h.dayOfWeek === dayIndex);
    if (targetIndex >= 0) {
      newHours[targetIndex] = { ...newHours[targetIndex], [field]: value };
      setHours(newHours);
    }
  };

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = { ...settings, businessHours: hours };
      if (!payload.logoUrl) payload.logoUrl = null;

      await api.put('/settings/tenant', payload);
      alert('Informações atualizadas com sucesso!');
    } catch (error: unknown) {
      console.error("Erro ao salvar:", error);
      // Feedback amigável se o bloqueio vier do backend
      const axiosError = error as { response?: { data?: { message?: string } } };
      if (axiosError.response?.data?.message?.includes('Upgrade necessário')) {
        alert(axiosError.response.data.message);
      } else {
        alert('Erro ao salvar. Verifique o servidor.');
        toast.error('Erro ao salvar configurações');
      }
    } finally {
      setIsSaving(false);
    }
  }



  if (isLoading) return <MainLayout title="Carregando..."><Loader2 className="animate-spin" /></MainLayout>;

  return (
    <MainLayout title="Meu Negócio">
      <div className="max-w-6xl mx-auto">
        {/* Banner */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="flex items-start gap-5">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <BrainCircuit className="w-8 h-8 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Cérebro da IA</h2>
              <p className="text-indigo-100 text-sm">Configure os dados essenciais para que seu Agente de IA atenda corretamente.</p>
              <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wide">
                Plano Atual: {currentPlan}
              </span>
            </div>
          </div>
        </div>

        {/* Abas */}
        {/* Abas - REMOVIDAS, AGORA É SÓ UMA VISÃO */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
            <h2 className="px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400">
                <Store className="w-4 h-4" /> Dados & Horários
            </h2>
        </div>



          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              
              {/* Card Localização (Mantido igual) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
                  <MapPin className="w-5 h-5 text-indigo-500" /> Localização & Contato
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Nome do Estabelecimento</label>
                    <input className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" value={settings.businessName || ''} onChange={e => setSettings({...settings, businessName: e.target.value})} placeholder="Ex: Barbearia CodeIA" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Telefone Público</label>
                    <input className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" value={settings.contactPhone || ''} onChange={e => setSettings({...settings, contactPhone: e.target.value})} placeholder="(XX) 99999-9999" />
                  </div>
                </div>
                <div className="mb-5">
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Endereço Completo</label>
                  <input className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" value={settings.address || ''} onChange={e => setSettings({...settings, address: e.target.value})} placeholder="Rua, Número, Bairro, Cidade" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Website</label>
                  <input className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" value={settings.website || ''} onChange={e => setSettings({...settings, website: e.target.value})} placeholder="https://..." />
                </div>
              </div>

              {/* ✅ CARD DE LEMBRETES (BLOQUEADO SE PLANO < SECONDARY) */}
              <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl border transition-all ${isPlanEligible() ? 'border-slate-200 dark:border-slate-800' : 'border-orange-200 dark:border-orange-900/30 bg-orange-50/50 dark:bg-orange-950/10'}`}>
                <h3 className="font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg border-b border-slate-100 dark:border-slate-800 pb-4">
                  <BellRing className={`w-5 h-5 ${isPlanEligible() ? 'text-orange-500' : 'text-slate-400'}`} /> 
                  Lembretes Automáticos
                  {!isPlanEligible() && (
                    <span className="ml-auto text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Plano Secondary
                    </span>
                  )}
                </h3>
                
                <div className="flex items-center justify-between mb-6">
                  <div className={!isPlanEligible() ? 'opacity-50' : ''}>
                    <label htmlFor="reminder-toggle" className="text-sm font-medium text-slate-900 dark:text-white block">Ativar Lembretes no WhatsApp</label>
                    <p className="text-xs text-slate-500">A IA enviará uma mensagem automática confirmando o horário.</p>
                  </div>
                  
                  <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                    <input 
                      id="reminder-toggle"
                      type="checkbox" 
                      className="peer absolute w-0 h-0 opacity-0"
                      checked={isPlanEligible() && (settings.reminderEnabled || false)} // Força false se bloqueado
                      onChange={e => {
                        if (!isPlanEligible()) return alert('Faça upgrade para o plano Secondary para usar lembretes!');
                        setSettings({...settings, reminderEnabled: e.target.checked})
                      }}
                      disabled={!isPlanEligible()} // Desabilita o input real
                    />
                    <label 
                      htmlFor="reminder-toggle"
                      className={`block w-12 h-6 rounded-full cursor-pointer transition-colors duration-200 ${
                        !isPlanEligible() ? 'bg-slate-200 dark:bg-slate-800 cursor-not-allowed' :
                        settings.reminderEnabled ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                      }`}
                    />
                    <label 
                      htmlFor="reminder-toggle"
                      className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 cursor-pointer ${
                        !isPlanEligible() ? 'cursor-not-allowed' : ''
                      } ${
                        settings.reminderEnabled && isPlanEligible() ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </div>
                </div>

                <div className={`transition-all duration-300 ${settings.reminderEnabled && isPlanEligible() ? 'opacity-100 max-h-40' : 'opacity-50 max-h-0 overflow-hidden pointer-events-none'}`}>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Enviar lembrete com antecedência de:</label>
                  <select 
                    className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950"
                    value={settings.reminderMinutes || 60}
                    onChange={e => setSettings({...settings, reminderMinutes: Number(e.target.value)})}
                  >
                    <option value={15}>15 minutos antes</option>
                    <option value={30}>30 minutos antes</option>
                    <option value={60}>1 hora antes</option>
                    <option value={120}>2 horas antes</option>
                    <option value={1440}>24 horas (1 dia) antes</option>
                  </select>
                </div>
              </div>

              {/* Card Instruções (Mantido) */}
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-lg">
                  <BrainCircuit className="w-5 h-5 text-purple-500" /> Conhecimento da IA (Instruções do Negócio)
                </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Escreva aqui tudo o que a IA precisa saber sobre seu negócio: nome do profissional, regras específicas, política de cancelamento, diferenciais... 
                    <br/><span className="text-xs text-purple-500 font-bold">* Isso é confidencial e usado apenas para contextualizar a IA.</span>
                  </p>
                <textarea 
                    className="w-full h-48 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent" 
                    value={settings.aiKnowledge || ''} 
                    onChange={e => setSettings({...settings, aiKnowledge: e.target.value})} 
                    placeholder="Ex: O Thiago tem 10 anos de experiência. Aceitamos PIX e Cartão. Tolerância de atraso é 10 min. Para agendar, precisa de sinal de 50%..." 
                />
              </div>
            </div>
            
            {/* Coluna Direita (Mantido) */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-emerald-500" /> Horários
                </h3>
                <div className="space-y-4">
                  {DAYS_CONFIG.map((dayConfig) => {
                    const currentHour = hours.find(h => h.dayOfWeek === dayConfig.index) || { isOpen: false, startTime: '', endTime: '' };
                    
                    return (
                      <div key={dayConfig.index} className={`flex items-center justify-between text-sm p-2 rounded-lg transition-colors ${currentHour.isOpen ? 'bg-slate-50 dark:bg-slate-800/50' : 'opacity-60'}`}>
                        <div className="flex items-center gap-3">
                          <input 
                            type="checkbox" 
                            checked={currentHour.isOpen} 
                            onChange={(e) => updateHour(dayConfig.index, 'isOpen', e.target.checked)} 
                            className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 w-4 h-4 cursor-pointer" 
                          />
                          <span className="font-medium text-slate-600 dark:text-slate-300 w-24 text-xs uppercase">{dayConfig.label}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <input 
                            type="time" 
                            disabled={!currentHour.isOpen} 
                            value={currentHour.startTime} 
                            onChange={(e) => updateHour(dayConfig.index, 'startTime', e.target.value)} 
                            className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" 
                          />
                          <span className="text-slate-400 text-xs text-center w-3">-</span>
                          <input 
                            type="time" 
                            disabled={!currentHour.isOpen} 
                            value={currentHour.endTime} 
                            onChange={(e) => updateHour(dayConfig.index, 'endTime', e.target.value)} 
                            className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs focus:ring-1 focus:ring-emerald-500 outline-none" 
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button type="submit" disabled={isSaving} className="mt-8 w-full btn-primary flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium shadow-lg disabled:opacity-70 transition-all">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />} Salvar Tudo
                </button>
              </div>
            </div>
          </form>

      </div>
    </MainLayout>
  );
}