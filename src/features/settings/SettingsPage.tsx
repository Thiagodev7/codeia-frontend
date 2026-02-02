import { Bell, Building, Globe, Loader2, Palette, Save, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
// CORREÇÃO: Uso de 'import type' para satisfazer o compilador
import { toast } from 'sonner';
import type { TenantSettings, UserSettings } from '../../types';

export function SettingsPage() {
  const { user } = useAuth(); // Agora 'user' tem a propriedade 'role' correta
  const [activeTab, setActiveTab] = useState<'personal' | 'company'>('personal');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Estados com valores padrão
  const [userSettings, setUserSettings] = useState<UserSettings>({
    theme: 'system',
    language: 'pt-BR',
    emailAlerts: true,
    whatsappAlerts: true
  });

  const [tenantSettings, setTenantSettings] = useState<TenantSettings>({
    id: '',
    primaryColor: '#06b6d4',
    logoUrl: '',
    timezone: 'America/Sao_Paulo',
    businessHours: [], // ✅ Array vazio, não objeto
    reminderEnabled: false,
    reminderMinutes: 60
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, tenantRes] = await Promise.all([
          api.get('/settings/me'),
          api.get('/settings/tenant')
        ]);
        
        if (userRes.data) setUserSettings(prev => ({ ...prev, ...userRes.data }));
        if (tenantRes.data) setTenantSettings(prev => ({ ...prev, ...tenantRes.data }));
      } catch (error) {
        console.error("Erro ao carregar configurações:", error);
        toast.error('Erro ao carregar configurações');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      if (activeTab === 'personal') {
        await api.put('/settings/me', userSettings);
        toast.success('Preferências pessoais salvas com sucesso!'); 
      } else {
        await api.put('/settings/tenant', tenantSettings);
        toast.success('Configurações da empresa atualizadas com sucesso!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Erro ao salvar alterações.');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <MainLayout title="Configurações">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 text-cyan-600 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  // Agora o TypeScript reconhece 'role' porque importamos o User do types/index.ts
  const isAdmin = user?.role === 'ADMIN';

  return (
    <MainLayout title="Configurações do Sistema">
      <div className="max-w-4xl mx-auto">
        
        {/* Abas */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-6">
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'personal' 
                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <User className="w-4 h-4" /> Minhas Preferências
          </button>
          
          {isAdmin && (
            <button
              onClick={() => setActiveTab('company')}
              className={`px-6 py-3 text-sm font-medium flex items-center gap-2 border-b-2 transition-colors ${
                activeTab === 'company' 
                  ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Building className="w-4 h-4" /> Dados da Empresa
            </button>
          )}
        </div>

        {/* Formulário */}
        <form onSubmit={handleSave} className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
          
          {activeTab === 'personal' ? (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Palette className="w-5 h-5 text-purple-500" /> Aparência e Idioma
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Tema</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={userSettings.theme}
                      onChange={e => setUserSettings({...userSettings, theme: e.target.value as 'light' | 'dark' | 'system'})}
                    >
                      <option value="light">Claro</option>
                      <option value="dark">Escuro</option>
                      <option value="system">Sistema</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Idioma</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={userSettings.language}
                      onChange={e => setUserSettings({...userSettings, language: e.target.value})}
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es">Español</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-yellow-500" /> Notificações
                </h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      checked={userSettings.emailAlerts}
                      onChange={e => setUserSettings({...userSettings, emailAlerts: e.target.checked})}
                    />
                    <span className="text-slate-700 dark:text-slate-300">Receber alertas por E-mail</span>
                  </label>
                  
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      className="peer h-5 w-5 cursor-pointer rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                      checked={userSettings.whatsappAlerts}
                      onChange={e => setUserSettings({...userSettings, whatsappAlerts: e.target.checked})}
                    />
                    <span className="text-slate-700 dark:text-slate-300">Receber alertas no WhatsApp</span>
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div>
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Building className="w-5 h-5 text-cyan-500" /> Identidade da Empresa
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Cor Primária</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        value={tenantSettings.primaryColor}
                        onChange={e => setTenantSettings({...tenantSettings, primaryColor: e.target.value})}
                        className="h-11 w-12 rounded cursor-pointer border-0 p-0"
                      />
                      <input 
                        type="text" 
                        className="flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 font-mono text-sm uppercase"
                        value={tenantSettings.primaryColor}
                        onChange={e => setTenantSettings({...tenantSettings, primaryColor: e.target.value})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL do Logo</label>
                    <input 
                      type="text" 
                      placeholder="https://..."
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={tenantSettings.logoUrl || ''}
                      onChange={e => setTenantSettings({...tenantSettings, logoUrl: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-6">
                <h3 className="text-lg font-medium text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-500" /> Localização
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Fuso Horário</label>
                    <select 
                      className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-cyan-500 outline-none"
                      value={tenantSettings.timezone}
                      onChange={e => setTenantSettings({...tenantSettings, timezone: e.target.value})}
                    >
                      <option value="America/Sao_Paulo">Brasília (GMT-3)</option>
                      <option value="America/New_York">New York (EST)</option>
                      <option value="Europe/London">London (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex justify-end">
            <button 
              type="submit" 
              disabled={isSaving} 
              className="btn-primary flex items-center gap-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-2.5 rounded-xl font-medium shadow-lg shadow-cyan-900/20 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
            >
              {isSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Salvando...</> : <><Save className="w-4 h-4" /> Salvar Alterações</>}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
}