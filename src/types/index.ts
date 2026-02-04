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
  businessHours: BusinessHour[]; // ✅ Tipado corretamente
  reminderEnabled: boolean; // ✅ Novo
  reminderMinutes: number;  // ✅ Novo
}

export interface Service {
  id: string;
  name: string;
  description?: string;
  aiDescription?: string; // ✅ Instruções para IA
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

// ============================================
// API Response Types (v2.0)
// ============================================

/** Metadados de paginação retornados pela API */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/** Resposta paginada genérica da API */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Horário de funcionamento por dia da semana */
export interface BusinessHour {
  dayOfWeek: number; // 0-6 (Dom-Sab)
  startTime: string; // "09:00"
  endTime: string;   // "18:00"
  isOpen: boolean;
}

/** Resposta de erro da API */
export interface ApiError {
  statusCode: number;
  code: 'VALIDATION_ERROR' | 'UNAUTHORIZED' | 'RESOURCE_NOT_FOUND' | 'CONFLICT' | 'INTERNAL_ERROR';
  message: string;
  details?: Record<string, unknown>;
}