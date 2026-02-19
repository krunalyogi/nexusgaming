import { create } from 'zustand';
import { authAPI } from '@/lib/api';

interface User {
    _id: string;
    username: string;
    email?: string;
    avatar: string;
    bio: string;
    role: string;
    status: string;
    steamLevel: number;
    totalPlaytime: number;
    country: string;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (username: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    loadUser: () => Promise<void>;
    setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    isAuthenticated: false,
    isLoading: true,

    login: async (email, password) => {
        const { data } = await authAPI.login({ email, password });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({ user: data.user, isAuthenticated: true });
    },

    register: async (username, email, password) => {
        const { data } = await authAPI.register({ username, email, password });
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        set({ user: data.user, isAuthenticated: true });
    },

    logout: async () => {
        try { await authAPI.logout(); } catch (_) { }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ user: null, isAuthenticated: false });
    },

    loadUser: async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) { set({ isLoading: false }); return; }
            const { data } = await authAPI.getMe();
            set({ user: data.user, isAuthenticated: true, isLoading: false });
        } catch {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            set({ user: null, isAuthenticated: false, isLoading: false });
        }
    },

    setUser: (user) => set({ user }),
}));
