import { create } from 'zustand';
import { authApi } from '../services/api.js';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  sellerStatus: 'NOT_APPLIED' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED';
  avatarUrl?: string;
  bio?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  setUser: (user) => set({ user, isLoading: false }),
  checkAuth: async () => {
    try {
      set({ isLoading: true });
      const user = await authApi.getMe();
      set({ user, isLoading: false });
    } catch {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    try {
      await authApi.logout();
    } finally {
      set({ user: null });
    }
  },
}));
