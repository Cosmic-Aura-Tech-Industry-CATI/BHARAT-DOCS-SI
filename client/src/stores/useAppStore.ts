import { create } from 'zustand';
import { User, UserRole, Organization } from '@/types/auth';
import { api } from '@/lib/api';

interface AppStoreState {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;

  user: User;
  organization: Organization;
  setUserRole: (role: UserRole) => void;

  isDemoMode: boolean;
  setDemoMode: (enabled: boolean) => void;
  toggleDemoMode: () => void;
}

export const useAppStore = create<AppStoreState>((set) => ({
  sidebarOpen: true,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),

  user: {
    id: 'usr-ca-101',
    name: 'Rajesh Sharma, FCA',
    email: 'rajesh.ca@sharmaassociates.in',
    role: 'CHARTERED_ACCOUNTANT',
    organization_id: 'org-sharma-1',
    organization_name: 'Sharma & Associates Chartered Accountants',
    pan_masked: 'AAECS8912P',
    gstin: '27AAGCS5678Q1Z2',
  },

  organization: {
    id: 'org-sharma-1',
    name: 'Sharma & Associates CA',
    gstin: '27AAGCS5678Q1Z2',
    plan: 'PROFESSIONAL',
    tier_limits: {
      monthly_docs: 500,
      used_docs: 142,
      retention_days: 365,
    },
  },

  setUserRole: (role) =>
    set((state) => ({
      user: { ...state.user, role },
    })),

  isDemoMode: true, // Default to demo mode for initial presentation until backend starts
  setDemoMode: (enabled) => {
    api.setDemoMode(enabled);
    set({ isDemoMode: enabled });
  },
  toggleDemoMode: () =>
    set((state) => {
      const next = !state.isDemoMode;
      api.setDemoMode(next);
      return { isDemoMode: next };
    }),
}));
