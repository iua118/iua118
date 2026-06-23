import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setToken: (token) => set({ token }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { login } = await import('../api/auth');
          const response = await login({ email, password });
          set({
            token: response.access_token,
            user: response.user,
            isAuthenticated: true,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Đăng nhập thất bại',
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (
        email: string,
        password: string,
        firstName: string,
        lastName: string,
      ) => {
        set({ isLoading: true, error: null });
        try {
          const { register } = await import('../api/auth');
          const response = await register({
            email,
            password,
            firstName,
            lastName,
          });
          set({
            token: response.access_token,
            user: response.user,
            isAuthenticated: true,
          });
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Đăng ký thất bại',
            isAuthenticated: false,
          });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
