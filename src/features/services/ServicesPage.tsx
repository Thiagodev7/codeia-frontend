import {
    Brain,
    Clock,
    Edit2,
    Loader2,
    Plus,
    Scissors,
    Search,
    Settings // Import Settings icon
    ,
    Sparkles,
    Trash2,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { toast } from 'sonner';
import { MainLayout } from '../../components/layout/MainLayout';
import { api } from '../../lib/api';
import type { Service } from '../../types';

interface TenantSettings {
  allowGenericServices: boolean;
  genericServiceDuration: number;
}

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settings, setSettings] = useState<TenantSettings>({ allowGenericServices: false, genericServiceDuration: 30 });
  
  const [editingService, setEditingService] = useState<Partial<Service>>({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await api.get('/settings/tenant');
      setSettings({
        allowGenericServices: res.data.allowGenericServices ?? false,
        genericServiceDuration: res.data.genericServiceDuration ?? 30,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function fetchServices() {
    try {
      const res = await api.get('/services');
      setServices(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Erro ao carregar serviços');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        ...editingService,
        price: Number(editingService.price),
        duration: Number(editingService.duration)
      };

      if (editingService.id) {
        await api.put(`/services/${editingService.id}`, payload);
        toast.success('Serviço atualizado!');
      } else {
        await api.post('/services', payload);
        toast.success('Serviço criado!');
      }
      setIsModalOpen(false);
      fetchServices();
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar serviço');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Tem certeza que deseja excluir?')) return;
    try {
      await api.delete(`/services/${id}`);
      toast.success('Serviço removido');
      setServices(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
      toast.error('Erro ao excluir');
    }
  }

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <MainLayout title="Catálogo de Serviços">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Hero */}
        <div className="mb-8 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                    <Scissors className="w-6 h-6 text-purple-600" />
                    Gestão de Serviços
                </h2>
                <p className="text-slate-600 dark:text-slate-400 mt-1 max-w-xl font-medium">
                    Cadastre seus produtos e serviços com detalhes. Use o campo "Instruções para IA" para ensinar seu agente a vender melhor.
                </p>
            </div>
            <div className="flex gap-3">
                <button 
                    onClick={() => setIsSettingsModalOpen(true)}
                    className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 shadow-sm"
                    title="Configurações de Agendamento"
                >
                    <Settings className="w-5 h-5" />
                </button>
                <button 
                    onClick={() => { setEditingService({}); setIsModalOpen(true); }}
                    className="btn-primary flex items-center gap-2 px-6 py-3 shadow-lg shadow-purple-900/10 hover:shadow-purple-900/20"
                >
                    <Plus className="w-5 h-5" /> Novo Serviço
                </button>
            </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 pointer-events-none" />
            <input 
                type="text" 
                placeholder="Buscar serviços..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field w-full pl-12 py-3 rounded-xl border-slate-200 dark:border-slate-800"
            />
        </div>

        {/* Lista de Serviços (Grid) */}
        {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-purple-500" /></div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredServices.map(service => (
                    <div key={service.id} className="group bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        {/* Header do Card */}
                        <div className="p-6 pb-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg text-slate-800 dark:text-white line-clamp-1">{service.name}</h3>
                                <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingService(service); setIsModalOpen(true); }} className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-600 dark:text-slate-400"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDelete(service.id)} className="p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg text-red-600 dark:text-red-400"><Trash2 className="w-4 h-4" /></button>
                                </div>
                            </div>
                            <div className="flex items-baseline gap-1 text-emerald-600 dark:text-emerald-400 font-bold text-xl">
                                <span className="text-sm font-normal text-slate-500 dark:text-slate-400">R$</span> {Number(service.price).toFixed(2)}
                            </div>
                        </div>

                        {/* Detalhes */}
                        <div className="px-6 space-y-3 pb-6 border-b border-slate-100 dark:border-slate-800">
                             <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 font-medium">
                                <Clock className="w-4 h-4 text-slate-400" /> {service.duration} mins
                            </div>
                            <p className="text-sm text-slate-700 dark:text-slate-400 line-clamp-2 min-h-[40px]">
                                {service.description || <span className="italic opacity-50">Sem descrição pública.</span>}
                            </p>
                        </div>

                        {/* Área da IA */}
                        <div className="bg-purple-50/50 dark:bg-purple-900/10 p-4 border-t border-purple-100 dark:border-purple-900/20">
                            <div className="flex items-center gap-2 text-xs font-bold text-purple-700 dark:text-purple-300 mb-2 uppercase tracking-wide">
                                <Brain className="w-3 h-3" /> Instruções da I.A.
                            </div>
                            <p className="text-xs text-purple-800/80 dark:text-purple-200/80 leading-relaxed font-medium">
                                {service.aiDescription ? (
                                    <>"{service.aiDescription}"</>
                                ) : (
                                    <span className="opacity-50 italic">Nenhuma instrução especial configurada.</span>
                                )}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        )}

        {/* Modal via Portal - Resolve o problema de corte */}
        {isModalOpen && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                {/* Overlay Click para fechar */}
                <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

                <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[90vh] border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                     <div className="flex-none p-6 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-900 rounded-t-2xl">
                        <h3 className="font-bold text-lg text-slate-800 dark:text-white flex items-center gap-2">
                            {editingService.id ? <Edit2 className="w-5 h-5 text-purple-600"/> : <Plus className="w-5 h-5 text-purple-600"/>}
                            {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
                        </h3>
                        <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-1 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors">
                            <X className="w-5 h-5"/>
                        </button>
                    </div>
                    
                    <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-5">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome do Serviço</label>
                                <input required className="input-field w-full" placeholder="Ex: Corte Degrade" value={editingService.name || ''} onChange={e => setEditingService({...editingService, name: e.target.value})} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Preço (R$)</label>
                                <input type="number" step="0.01" required className="input-field w-full" placeholder="0.00" value={editingService.price === undefined ? '' : editingService.price} onChange={e => setEditingService({...editingService, price: Number(e.target.value)})} />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Duração (minutos)</label>
                                <input type="number" required className="input-field w-full" placeholder="30" value={editingService.duration || ''} onChange={e => setEditingService({...editingService, duration: Number(e.target.value)})} />
                            </div>

                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Descrição Pública (App/Site)</label>
                                <textarea className="input-field w-full h-20 resize-none py-2" placeholder="Opcional. Exibe para o cliente." value={editingService.description || ''} onChange={e => setEditingService({...editingService, description: e.target.value})} />
                            </div>

                            <div className="col-span-2 bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-900/20">
                                <label className="text-purple-800 dark:text-purple-300 flex items-center gap-2 text-sm font-bold mb-2">
                                    <Sparkles className="w-4 h-4" /> Instruções para o Agente IA
                                </label>
                                <textarea 
                                    className="input-field w-full h-24 resize-none border-purple-200 dark:border-purple-800 focus:ring-purple-500 bg-white dark:bg-slate-950" 
                                    placeholder="Ex: Ofereça 10% de desconto à vista. Avise que precisa chegar 10min antes. Só agende com aprovação..." 
                                    value={editingService.aiDescription || ''} 
                                    onChange={e => setEditingService({...editingService, aiDescription: e.target.value})} 
                                />
                                <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-2">
                                    Isso é invisível para o cliente, mas essencial para a IA saber como vender este item.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
                            <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors">Cancelar</button>
                            <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 px-6">
                                {isSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : null} 
                                Salvar Serviço
                            </button>
                        </div>
                    </form>
                </div>
            </div>,
            document.body // O portal injeta o modal aqui
        )}

        {/* Modal de Configurações Gerais */}
        {isSettingsModalOpen && createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="absolute inset-0" onClick={() => setIsSettingsModalOpen(false)} />
                <div className="relative bg-white dark:bg-slate-900 rounded-2xl w-full max-w-md shadow-2xl p-6 border border-slate-200 dark:border-slate-800 animate-in zoom-in-95 duration-200">
                    
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2">
                            <Settings className="w-5 h-5 text-slate-500"/> Configurações de Agendamento
                        </h3>
                        <button onClick={() => setIsSettingsModalOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                            <X className="w-5 h-5"/>
                        </button>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <label className="font-semibold text-slate-800 dark:text-white block">Permitir Serviços Genéricos</label>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                        Se ativado, a IA poderá agendar serviços que não estão na lista (ex: "Barba" ou "Sobrancelha").
                                    </p>
                                </div>
                                <div 
                                    onClick={async () => {
                                        const newValue = !settings.allowGenericServices;
                                        setSettings(s => ({...s, allowGenericServices: newValue}));
                                        try {
                                            await api.put('/settings/tenant', { ...settings, allowGenericServices: newValue });
                                            toast.success(newValue ? 'Serviços genéricos ativados!' : 'Serviços genéricos desativados.');
                                        } catch(e) { toast.error('Erro ao salvar'); }
                                    }}
                                    className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${settings.allowGenericServices ? 'bg-purple-600' : 'bg-slate-300 dark:bg-slate-700'}`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${settings.allowGenericServices ? 'translate-x-6' : 'translate-x-0'}`} />
                                </div>
                            </div>

                            {settings.allowGenericServices && (
                                <div className="animate-in slide-in-from-top-2 duration-200">
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                                        Duração Padrão para Genéricos (min)
                                    </label>
                                    <div className="flex gap-2">
                                        <input 
                                            type="number" 
                                            className="input-field flex-1"
                                            value={settings.genericServiceDuration}
                                            onChange={e => setSettings(s => ({...s, genericServiceDuration: Number(e.target.value)}))}
                                        />
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await api.put('/settings/tenant', { ...settings });
                                                    toast.success('Duração salva!');
                                                } catch(e) { toast.error('Erro ao salvar'); }
                                            }}
                                            className="btn-secondary px-4 text-sm"
                                        >
                                            Salvar Tempo
                                        </button>
                                    </div>
                                    <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 flex items-center gap-1">
                                        ⚠️ O preço será combinado no local (Sob Consulta).
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>,
            document.body
        )}

      </div>
    </MainLayout>
  );
}