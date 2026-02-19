'use client';
import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { loadUser, isAuthenticated } = useAuthStore();
    const { connect } = useChatStore();

    useEffect(() => { loadUser(); }, [loadUser]);

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('accessToken');
            if (token) connect(token);
        }
    }, [isAuthenticated, connect]);

    return <>{children}</>;
}
