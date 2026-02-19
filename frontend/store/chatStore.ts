import { create } from 'zustand';
import { io, Socket } from 'socket.io-client';

interface Notification {
    type: string;
    title: string;
    message: string;
}

interface ChatState {
    socket: Socket | null;
    onlineUsers: string[];
    notifications: Notification[];
    connect: (token: string) => void;
    disconnect: () => void;
    addNotification: (n: Notification) => void;
    clearNotifications: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
    socket: null,
    onlineUsers: [],
    notifications: [],

    connect: (token) => {
        const existingSocket = get().socket;
        if (existingSocket?.connected) return;

        const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
            auth: { token },
        });

        socket.on('connect', () => console.log('🟢 Socket connected'));
        socket.on('user_status', (data: any) => {
            set((state) => ({
                onlineUsers: data.status === 'online'
                    ? [...state.onlineUsers, data.userId]
                    : state.onlineUsers.filter((id) => id !== data.userId),
            }));
        });
        socket.on('notification', (n: Notification) => {
            set((state) => ({ notifications: [n, ...state.notifications] }));
        });
        socket.on('disconnect', () => console.log('🔴 Socket disconnected'));

        set({ socket });
    },

    disconnect: () => {
        get().socket?.disconnect();
        set({ socket: null, onlineUsers: [] });
    },

    addNotification: (n) => set((state) => ({ notifications: [n, ...state.notifications] })),
    clearNotifications: () => set({ notifications: [] }),
}));
