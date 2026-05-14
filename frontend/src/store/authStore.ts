import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types/user';

export const AUTH_STORAGE_KEY = 'medical_center_auth';
export const TOKEN_STORAGE_KEY = 'medical_center_token';

interface AuthState {
  token: string | null;
  user: User | null;
  initialized: boolean;
  setAuth: (token: string, user: User) => void;
  setUser: (user: User | null) => void;
  setInitialized: (value: boolean) => void;
  logout: () => void;
}

const syncToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      initialized: false,
      setAuth: (token, user) => {
        syncToken(token);
        set({ token, user, initialized: true });
      },
      setUser: (user) => set({ user }),
      setInitialized: (initialized) => set({ initialized }),
      logout: () => {
        syncToken(null);
        set({ token: null, user: null, initialized: true });
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        token: state.token,
        user: state.user,
      }),
      onRehydrateStorage: () => (state) => {
        syncToken(state?.token ?? null);
      },
    },
  ),
);
