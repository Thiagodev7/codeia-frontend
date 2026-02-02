import { Calendar, Clock } from 'lucide-react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';
import { Card } from '../ui/Card';

interface ChartsProps {
  appointmentData: { name: string; value: number }[];
  messageData: { name: string; value: number }[];
}

export function DashboardCharts({ appointmentData, messageData }: ChartsProps) {
  const hasAppointmentData = appointmentData && appointmentData.length > 0;
  const hasMessageData = messageData && messageData.length > 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Gráfico de Agendamentos (Barras) */}
      <Card>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-500" />
                Agendamentos (Semana)
            </h3>
        </div>
        <div className="h-[250px] w-full flex items-center justify-center">
            {hasAppointmentData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={appointmentData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip 
                            cursor={{ fill: 'transparent' }}
                            contentStyle={{ 
                                backgroundColor: '#fff', 
                                borderRadius: '8px', 
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                            }}
                        />
                        <Bar 
                            dataKey="value" 
                            fill="#10b981" 
                            radius={[4, 4, 0, 0]} 
                            barSize={32}
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-center text-slate-400 text-sm">
                    Não há dados suficientes para exibir o gráfico.
                </div>
            )}
        </div>
      </Card>

      {/* Gráfico de Mensagens (Área) */}
      <Card>
        <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-slate-800 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Volume de Mensagens (Hoje)
            </h3>
        </div>
        <div className="h-[250px] w-full flex items-center justify-center">
            {hasMessageData ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={messageData}>
                        <defs>
                            <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#64748b', fontSize: 12 }} 
                            dy={10}
                        />
                        <YAxis hide />
                        <Tooltip />
                        <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#3b82f6" 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill="url(#colorMessages)" 
                        />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-center text-slate-400 text-sm">
                    Aguardando novas mensagens...
                </div>
            )}
        </div>
      </Card>
    </div>
  );
}
