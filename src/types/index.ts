export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'AGENT';
  tenantId: string;
}

export interface TenantSettings {
  id: string;
  primaryColor: string;
  logoUrl: string | null;
  timezone: string;
  businessHours: any; // ou Record<string, { start: string; end: string }> | null
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