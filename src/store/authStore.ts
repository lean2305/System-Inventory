import { create } from 'zustand';
import { User } from '../types';

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  hasPermission: (permission: string) => boolean;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),
  hasPermission: (permission) => {
    const { user } = get();
    return user?.permissions.some((p) => p.name === permission) ?? false;
  },
}));