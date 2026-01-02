import { useState, useEffect } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { api } from '../../lib/api';
import { 
  Store, Clock, MapPin, Globe, Save, Plus, Trash2, Edit2, Loader2,
  BrainCircuit, Scissors, Phone
} from 'lucide-react';
import type { Service, TenantSettings } from '../../types';

// ... (DAYS_OF_WEEK e imports mantidos)
const DAYS_OF_WEEK = [
  { key: 'mon', label: 'Seg' }, { key: 'tue', label: 'Ter' },
  { key: 'wed', label: 'Qua' }, { key: 'thu', label: 'Qui' },
  { key: 'fri', label: 'Sex' }, { key: 'sat', label: 'Sab' },
  { key: 'sun', label: 'Dom' },
];

export function BusinessPage() {
  const [activeTab, setActiveTab] = useState<'info' | 'services'>('info');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [settings, setSettings] = useState<TenantSettings>({
    id: '', primaryColor: '#06b6d4', logoUrl: '', timezone: 'America/Sao_Paulo',
    businessHours: {}, businessName: '', description: '', address: '',
    contactPhone: '', website: ''
  });
  
  const [services, setServices] = useState<Service[]>([]);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service>>({});

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const [settingsRes, servicesRes] = await Promise.all([
        api.get('/settings/tenant'),
        api.get('/services').catch(() => ({ data: [] }))
      ]);
      setSettings(prev => ({ 
        ...prev, 
        ...settingsRes.data,
        businessHours: settingsRes.data.businessHours || {} 
      }));
      setServices(servicesRes.data || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setIsLoading(false);
    }
  }

  // --- Lógica de Horários ---
  const handleHourChange = (dayKey: string, type: 'start' | 'end', value: string) => {
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [dayKey]: {
          ...(prev.businessHours[dayKey] || { start: '09:00', end: '18:00', open: true }),
          [type]: value
        }
      }
    }));
  };

  const toggleDayOpen = (dayKey: string) => {
    const current = settings.businessHours[dayKey] || { start: '09:00', end: '18:00', open: true };
    setSettings(prev => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        [dayKey]: { ...current, open: !current.open }
      }
    }));
  }

  // --- AÇÃO 1: SALVAR TUDO (Settings) ---
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      // CORREÇÃO CRÍTICA: Criamos um payload limpo
      const payload = {
        primaryColor: settings.primaryColor,
        logoUrl: settings.logoUrl || null, // Garante envio de null se vazio
        timezone: settings.timezone,
        businessHours: settings.businessHours,
        businessName: settings.businessName || null,
        description: settings.description || null,
        address: settings.address || null,
        contactPhone: settings.contactPhone || null,
        website: settings.website || null
      };

      await api.put('/settings/tenant', payload);
      alert('Informações atualizadas com sucesso!');
    } catch (error) {
      console.error("Erro ao salvar settings:", error);
      alert('Erro ao salvar. Verifique se o Backend está rodando e atualizado.');
    } finally {
      setIsSaving(false);
    }
  }

  // --- AÇÃO 2: SALVAR SERVIÇO ---
  async function handleSaveService(e: React.FormEvent) {
    e.preventDefault();
    if (!editingService.name || editingService.price === undefined) {
        alert('Preencha nome e preço.');
        return;
    }

    try {
      // CORREÇÃO CRÍTICA: Payload estrito para evitar enviar ID ou datas no body
      const payload = {
        name: editingService.name,
        description: editingService.description || null,
        price: Number(editingService.price),
        duration: Number(editingService.duration || 30),
        isActive: editingService.isActive ?? true
      };

      if (editingService.id) {
        await api.put(`/services/${editingService.id}`, payload);
      } else {
        await api.post('/services', payload);
      }
      setIsServiceModalOpen(false);
      setEditingService({});
      fetchData(); 
    } catch (error) {
      console.error("Erro ao salvar serviço:", error);
      alert('Erro ao salvar serviço.');
    }
  }

  async function handleDeleteService(id: string) {
    if (!confirm('Tem certeza?')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erro ao excluir.');
    }
  }

  if (isLoading) return <MainLayout title="Carregando..."><Loader2 className="animate-spin" /></MainLayout>;

  return (
    <MainLayout title="Meu Negócio">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex items-start gap-5">
            <div className="p-3 bg-white/10 rounded-xl backdrop-blur-md border border-white/20">
              <BrainCircuit className="w-8 h-8 text-indigo-100" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">Cérebro da IA</h2>
              <p className="text-indigo-100 text-sm leading-relaxed max-w-2xl">
                Configure os dados essenciais para que seu Agente de IA atenda corretamente.
              </p>
            </div>
          </div>
        </div>

        {/* Abas */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8">
          <button onClick={() => setActiveTab('info')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'info' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Store className="w-4 h-4" /> Dados & Horários
          </button>
          <button onClick={() => setActiveTab('services')} className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-all ${activeTab === 'services' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
            <Scissors className="w-4 h-4" /> Catálogo de Serviços
          </button>
        </div>

        {/* Aba Info */}
        {activeTab === 'info' && (
          <form onSubmit={handleSaveSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
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
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-4 flex items-center gap-2 text-lg">
                  <BrainCircuit className="w-5 h-5 text-purple-500" /> Instruções Específicas
                </h3>
                <textarea className="w-full h-32 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 resize-none" value={settings.description || ''} onChange={e => setSettings({...settings, description: e.target.value})} placeholder="Regras de negócio, formas de pagamento..." />
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm sticky top-6">
                <h3 className="font-semibold text-slate-800 dark:text-white mb-6 flex items-center gap-2 text-lg">
                  <Clock className="w-5 h-5 text-emerald-500" /> Horários
                </h3>
                <div className="space-y-4">
                  {DAYS_OF_WEEK.map(day => {
                     const dayConfig = settings.businessHours?.[day.key] || { start: '09:00', end: '18:00', open: true };
                     const isOpen = dayConfig.open !== false;
                     return (
                      <div key={day.key} className={`flex items-center justify-between text-sm ${isOpen ? '' : 'opacity-50'}`}>
                        <div className="flex items-center gap-2">
                          <input type="checkbox" checked={isOpen} onChange={() => toggleDayOpen(day.key)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                          <span className="w-8 font-medium text-slate-500 uppercase text-xs">{day.label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <input type="time" disabled={!isOpen} value={dayConfig.start} onChange={(e) => handleHourChange(day.key, 'start', e.target.value)} className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs" />
                          <span className="text-slate-400 text-xs">-</span>
                          <input type="time" disabled={!isOpen} value={dayConfig.end} onChange={(e) => handleHourChange(day.key, 'end', e.target.value)} className="px-2 py-1 rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-xs" />
                        </div>
                      </div>
                    );
                  })}
                </div>
                <button type="submit" disabled={isSaving} className="mt-8 w-full btn-primary flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium shadow-lg disabled:opacity-70">
                  {isSaving ? <Loader2 className="animate-spin w-4 h-4"/> : <Save className="w-4 h-4" />} Salvar Tudo
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Aba Serviços */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-800 dark:text-white">Catálogo de Serviços</h3>
              <button onClick={() => { setEditingService({}); setIsServiceModalOpen(true); }} className="btn-primary bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-medium shadow-md">
                <Plus className="w-4 h-4" /> Novo Serviço
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {services.map(service => (
                <div key={service.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:shadow-xl transition-all group relative">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-slate-800 dark:text-white text-lg">{service.name}</h4>
                    <span className="bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400 text-xs px-2.5 py-1 rounded-full font-bold">R$ {Number(service.price).toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-5 line-clamp-2 h-10">{service.description || 'Sem descrição.'}</p>
                  <div className="flex items-center justify-between text-xs text-slate-400 font-mono border-t border-slate-100 dark:border-slate-800 pt-4">
                    <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {service.duration} min</span>
                  </div>
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => { setEditingService(service); setIsServiceModalOpen(true); }} className="p-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-lg"><Edit2 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteService(service.id)} className="p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal Serviços */}
        {isServiceModalOpen && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg p-8 shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{editingService?.id ? 'Editar' : 'Novo'} Serviço</h3>
                <button onClick={() => setIsServiceModalOpen(false)} className="text-slate-400">✕</button>
              </div>
              <form onSubmit={handleSaveService} className="space-y-5">
                <input className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" required placeholder="Nome" value={editingService?.name || ''} onChange={e => setEditingService(prev => ({...prev, name: e.target.value}))} />
                <div className="grid grid-cols-2 gap-5">
                  <input type="number" step="0.01" required className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="Preço" value={editingService?.price === undefined ? '' : editingService.price} onChange={e => setEditingService(prev => ({...prev, price: Number(e.target.value)}))} />
                  <input type="number" required className="input-field w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950" placeholder="Duração (min)" value={editingService?.duration || ''} onChange={e => setEditingService(prev => ({...prev, duration: Number(e.target.value)}))} />
                </div>
                <textarea className="input-field w-full h-24 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 resize-none" placeholder="Descrição" value={editingService?.description || ''} onChange={e => setEditingService(prev => ({...prev, description: e.target.value}))} />
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsServiceModalOpen(false)} className="px-5 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800">Cancelar</button>
                  <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700">Salvar</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}