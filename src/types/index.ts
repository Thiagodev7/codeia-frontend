export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
  tenantId: string;
}

export interface TenantSettings {
  id: string;
  // Identidade Visual
  primaryColor: string;
  logoUrl: string | null;
  // Localização e Negócio
  businessName?: string;
  description?: string; // Contexto vital para a IA
  address?: string;
  contactPhone?: string;
  website?: string;
  // Configurações Técnicas
  timezone: string;
  businessHours: any; // Idealmente: Record<string, { start: string, end: string, open: boolean }>
  reminderEnabled: boolean; // ✅ Novo
  reminderMinutes: number;  // ✅ Novo
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  duration: number; // em minutos
  isActive: boolean;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  language: string;
  emailAlerts: boolean;
  whatsappAlerts: boolean;
}

export interface Customer {
  id: string;
  name: string | null;
  phone: string;
  lastMessage?: string;
  updatedAt?: string;
  _count?: { messages: number };
}

export interface Appointment {
  id: string;
  title: string;
  description?: string | null;
  startTime: string; // ISO Date
  endTime: string;   // ISO Date
  status: 'SCHEDULED' | 'CANCELED' | 'COMPLETED';
  customer: {
    id: string;
    name: string | null;
    phone: string;
  };
  service?: {
    name: string;
    price: number;
  } | null;
}