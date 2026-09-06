// src/store/auth.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type User = {
  email: string;
  role: string;
};

type Token = {
  accessToken: string;
  refreshToken: string;
};

type AuthState = {
  user: User | null;
  token: Token | null;
  setAuth: (data: { user: User; token: Token }) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      setAuth: (data) =>
        set({
          user: data.user,
          token: data.token,
        }),
      logout: () =>
        set({
          user: null,
          token: null,
        }),
    }),
    {
      name: 'web-donasi-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);
