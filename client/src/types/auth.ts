export type UserRole = 'ADMIN' | 'CHARTERED_ACCOUNTANT' | 'ACCOUNTANT' | 'TAX_CONSULTANT' | 'AUDITOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization_id: string;
  organization_name: string;
  avatar_url?: string;
  pan_masked?: string;
  gstin?: string;
}

export interface Organization {
  id: string;
  name: string;
  gstin?: string;
  plan: 'TRIAL' | 'STARTER' | 'PROFESSIONAL' | 'ENTERPRISE';
  tier_limits: {
    monthly_docs: number;
    used_docs: number;
    retention_days: number;
  };
}

export interface AuthState {
  user: User | null;
  organization: Organization | null;
  token: string | null;
  isAuthenticated: boolean;
  isDemoMode: boolean;
}
