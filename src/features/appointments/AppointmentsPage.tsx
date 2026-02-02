import clsx from 'clsx';
import {
    Bot,
    CalendarDays,
    Calendar as CalendarIcon,
    ChevronLeft, ChevronRight,
    Clock,
    History, ListFilter,
    Phone,
    User,
    XCircle
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { MainLayout } from '../../components/layout/MainLayout';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { Tooltip } from '../../components/ui/Tooltip';
import { useAppointments } from '../../hooks/useAppointments'; // Hook

// --- HELPER: Calendário Puro (Sem bibliotecas pesadas) ---
function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay(); // 0=Dom
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  const days = [];
  // Preencher dias vazios antes do dia 1
  for (let i = 0; i < firstDay; i++) days.push(null);
  // Preencher dias do mês
  for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
  
  return days;
}

const MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];

export function AppointmentsPage() {
  // Estado de paginação (Client-Side por enquanto controla qual página da API buscamos)
  const [page, setPage] = useState(1);
  const { appointments, meta, isLoading, cancelAppointment } = useAppointments({ page, limit: 100 });
  
  // --- Estados de Controle Visual ---
  // Se selectedDate for null, usa o modo "viewMode" (Próximos/Todos)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [viewMode, setViewMode] = useState<'upcoming' | 'all' | 'history'>('upcoming');
  
  // Estado do Calendário Visual (Navegação Meses)
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Estado do Modal de Confirmação
  const [cancelId, setCancelId] = useState<string | null>(null);

  async function handleConfirmCancel() {
    if (!cancelId) return;
    try {
      await cancelAppointment(cancelId);
      setCancelId(null);
    } catch {
      // Erro tratado no hook
    }
  }

  // --- LÓGICA DE FILTRAGEM ---
  const filteredList = useMemo(() => {
    let list = [...appointments];

    // 1. Se tiver data selecionada, filtra por dia exato
    if (selectedDate) {
      const target = selectedDate.toLocaleDateString('en-CA');
      list = list.filter(app => new Date(app.startTime).toLocaleDateString('en-CA') === target);
    } 
    // 2. Se não, usa os filtros rápidos
    else {
      const now = new Date();
      if (viewMode === 'upcoming') {
        list = list.filter(app => new Date(app.startTime) >= now && app.status !== 'CANCELED');
      } else if (viewMode === 'history') {
        list = list.filter(app => new Date(app.startTime) < now || app.status === 'CANCELED');
      }
      // 'all' mostra tudo
    }

    // Ordenação
    return list.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  }, [appointments, selectedDate, viewMode]);

  // --- LÓGICA DO CALENDÁRIO ---
  const calendarDays = useMemo(() => 
    getCalendarDays(currentMonth.getFullYear(), currentMonth.getMonth()), 
  [currentMonth]);

  // Identifica dias que têm agendamento para mostrar a "bolinha"
  const activeDaysMap = useMemo(() => {
    const map = new Set<string>();
    appointments.forEach(a => {
      if (a.status !== 'CANCELED') {
        map.add(new Date(a.startTime).toLocaleDateString('en-CA'));
      }
    });
    return map;
  }, [appointments]);

  const changeMonth = (offset: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + offset, 1);
    setCurrentMonth(newDate);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setViewMode('all'); // Reseta o filtro visual para focar na data
  };

  const handleQuickFilter = (mode: typeof viewMode) => {
    setViewMode(mode);
    setSelectedDate(null); // Limpa seleção de data
  };

  if (isLoading) return <MainLayout title="Carregando...">Carregando...</MainLayout>;

  return (
    <MainLayout title="Minha Agenda">
      <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6">
        
        {/* --- COLUNA 1: CALENDÁRIO & FILTROS (Fixo ou Lateral) --- */}
        <div className="w-full md:w-80 flex flex-col gap-6">
          
          {/* Widget Calendário */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm">
            {/* Header Mês */}
            <div className="flex items-center justify-between mb-4">
              <button onClick={() => changeMonth(-1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ChevronLeft className="w-5 h-5"/></button>
              <h3 className="font-bold text-slate-800 dark:text-white capitalize">
                {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h3>
              <button onClick={() => changeMonth(1)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><ChevronRight className="w-5 h-5"/></button>
            </div>

            {/* Grid Dias */}
            <div className="grid grid-cols-7 text-center gap-y-2 text-sm">
              {WEEKDAYS.map(d => <span key={d} className="text-slate-400 text-xs font-medium py-1">{d}</span>)}
              
              {calendarDays.map((date, i) => {
                if (!date) return <div key={i} />;
                
                const dateStr = date.toLocaleDateString('en-CA');
                const isSelected = selectedDate?.toLocaleDateString('en-CA') === dateStr;
                const isToday = new Date().toLocaleDateString('en-CA') === dateStr;
                const hasApps = activeDaysMap.has(dateStr);

                return (
                  <button
                    key={i}
                    onClick={() => handleDateClick(date)}
                    className={clsx(
                      "w-8 h-8 mx-auto rounded-full flex items-center justify-center relative transition-all text-xs font-medium",
                      isSelected ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/30" : 
                      isToday ? "bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold" : 
                      "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    )}
                  >
                    {date.getDate()}
                    {/* Bolinha Indicadora */}
                    {hasApps && !isSelected && (
                      <div className="absolute bottom-0.5 w-1 h-1 rounded-full bg-indigo-500" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Widget Filtros Rápidos */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-2 border border-slate-200 dark:border-slate-800 shadow-sm space-y-1">
            <button 
              onClick={() => handleQuickFilter('upcoming')}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                !selectedDate && viewMode === 'upcoming' 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <CalendarDays className="w-4 h-4" />
              Próximos Agendamentos
            </button>
            
            <button 
              onClick={() => handleQuickFilter('history')}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                !selectedDate && viewMode === 'history' 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <History className="w-4 h-4" />
              Histórico / Cancelados
            </button>

            <button 
              onClick={() => handleQuickFilter('all')}
              className={clsx(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium",
                !selectedDate && viewMode === 'all' 
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
              )}
            >
              <ListFilter className="w-4 h-4" />
              Todos os Registros
            </button>
          </div>
        </div>

        {/* --- COLUNA 2: LISTA DE CARDS (O Formato Antigo) --- */}
        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
          
          {/* Header da Lista */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
              {selectedDate ? (
                <>
                  <span className="text-indigo-500 capitalize">{selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                  <span className="text-slate-400">, {selectedDate.getDate()} de {selectedDate.toLocaleDateString('pt-BR', { month: 'long' })}</span>
                </>
              ) : (
                <>
                  {viewMode === 'upcoming' && 'Próximos Compromissos'}
                  {viewMode === 'history' && 'Histórico'}
                  {viewMode === 'all' && 'Todos os Agendamentos'}
                </>
              )}
            </h2>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold px-3 py-1 rounded-full">
              {filteredList.length}
            </span>
          </div>

          {/* Cards */}
          <div className="space-y-4 pb-20">
            {filteredList.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                <CalendarIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">Nenhum agendamento encontrado.</p>
              </div>
            ) : (
              filteredList.map(app => {
                const dateObj = new Date(app.startTime);
                const isAi = app.description?.includes('Via IA') || !app.service;
                const isCanceled = app.status === 'CANCELED';

                return (
                  <div key={app.id} className={`bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-5 transition-all hover:shadow-md ${isCanceled ? 'opacity-60 grayscale' : ''}`}>
                    
                    {/* Coluna Data */}
                    <div className="flex items-center gap-4 min-w-[140px]">
                      <div className={clsx(
                        "p-3 rounded-xl text-center min-w-[60px]",
                        isCanceled ? "bg-red-50 text-red-500" : "bg-indigo-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400"
                      )}>
                        <span className="block text-xs font-bold uppercase">{dateObj.toLocaleDateString('pt-BR', { month: 'short' })}</span>
                        <span className="block text-xl font-bold">{dateObj.getDate()}</span>
                      </div>
                      <div>
                        <div className="font-bold text-slate-800 dark:text-white flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400"/>
                          {dateObj.toLocaleTimeString('pt-BR', {hour:'2-digit', minute:'2-digit'})}
                        </div>
                        <span className="text-xs text-slate-500 capitalize">{dateObj.toLocaleDateString('pt-BR', { weekday: 'long' })}</span>
                      </div>
                    </div>

                    {/* Coluna Detalhes */}
                    <div className="flex-1 pt-1 md:pt-0 border-t md:border-t-0 md:border-l border-slate-100 dark:border-slate-800 md:pl-5 mt-2 md:mt-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-bold text-slate-800 dark:text-white">{app.title}</h3>
                        {isAi && !isCanceled && <span className="bg-purple-100 text-purple-600 text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1"><Bot className="w-3 h-3"/> IA</span>}
                        {isCanceled && <span className="bg-red-100 text-red-600 text-[10px] px-2 py-0.5 rounded-full font-bold">CANCELADO</span>}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-y-1 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5"><User className="w-3.5 h-3.5"/> {app.customer.name || 'Cliente'}</div>
                        <div className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5"/> {app.customer.phone.split('@')[0]}</div>
                      </div>
                    </div>

                    {/* Coluna Ações */}
                    {!isCanceled && (
                      <div className="flex items-center justify-end">
                        <Tooltip content="Cancelar Agendamento">
                          <button 
                            onClick={() => setCancelId(app.id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          >
                            <XCircle className="w-5 h-5" />
                          </button>
                        </Tooltip>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
         
         {/* Paginação Simples */}
         {meta && (
            <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-slate-800">
              <span className="text-sm text-slate-500">Página {meta.page} de {meta.totalPages}</span>
              <div className="flex gap-2">
                <button 
                  disabled={meta.page === 1}
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded hover:opacity-80 disabled:opacity-50"
                >
                  Anterior
                </button>
                <button 
                  disabled={meta.page >= meta.totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-3 py-1 text-sm bg-slate-100 dark:bg-slate-800 rounded hover:opacity-80 disabled:opacity-50"
                >
                  Próxima
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
      
      {/* Modal de Confirmação de Cancelamento */}
      <ConfirmModal 
        isOpen={!!cancelId}
        onClose={() => setCancelId(null)}
        onConfirm={handleConfirmCancel}
        title="Cancelar Agendamento"
        description="Tem certeza que deseja cancelar este agendamento? Esta ação não pode ser desfeita e o cliente será notificado."
        confirmText="Sim, Cancelar"
        cancelText="Voltar"
        variant="danger"
      />
    </MainLayout>
  );
}