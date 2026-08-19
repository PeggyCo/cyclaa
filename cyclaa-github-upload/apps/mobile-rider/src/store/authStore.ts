/**
 * Auth store (Zustand).
 * Persists the JWT in secure storage and exposes the current user.
 * `login`/`signup` call the backend's /auth routes — those aren't built
 * yet (only /api/waitlist exists today), so they'll fail with a network
 * or 404 error until that lands. `initializeAuth` just restores a
 * previously-stored session on app boot.
 */
import { create } from 'zustand';
import { apiClient } from '@api/client';
import { getItem, setItem, removeItem } from '@utils/storage';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string;
  role: 'rider' | 'mechanic' | 'admin';
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isInitializing: boolean;
  isAuthenticated: boolean;
  error: string | null;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isInitializing: true,
  isAuthenticated: false,
  error: null,

  initializeAuth: async () => {
    try {
      const token = await getItem('cyclaa_token');
      const userJson = await getItem('cyclaa_user');
      if (token && userJson) {
        set({ token, user: JSON.parse(userJson), isAuthenticated: true });
      }
    } catch {
      // Corrupt/missing local session — treat as logged out.
    } finally {
      set({ isInitializing: false });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      const { data } = await apiClient.post('/auth/login', { email, password });
      await setItem('cyclaa_token', data.token);
      await setItem('cyclaa_user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || 'Unable to sign in. Please try again.' });
      throw err;
    }
  },

  signup: async (payload) => {
    set({ error: null });
    try {
      const { data } = await apiClient.post('/auth/register', payload);
      await setItem('cyclaa_token', data.token);
      await setItem('cyclaa_user', JSON.stringify(data.user));
      set({ token: data.token, user: data.user, isAuthenticated: true });
    } catch (err: any) {
      set({ error: err?.response?.data?.error || 'Unable to create your account. Please try again.' });
      throw err;
    }
  },

  logout: () => {
    removeItem('cyclaa_token');
    removeItem('cyclaa_user');
    set({ token: null, user: null, isAuthenticated: false });
  },

  clearError: () => set({ error: null }),
}));
