import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken');
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Response interceptor for token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && error.response?.data?.code === 'TOKEN_EXPIRED' && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('refreshToken', data.refreshToken);
                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return api(originalRequest);
            } catch (err) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                if (typeof window !== 'undefined') window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

// Auth
export const authAPI = {
    register: (data: any) => api.post('/auth/register', data),
    login: (data: any) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
    logout: () => api.post('/auth/logout'),
};

// Games
export const gamesAPI = {
    getAll: (params?: any) => api.get('/games', { params }),
    getFeatured: () => api.get('/games/featured'),
    getTrending: () => api.get('/games/trending'),
    getBySlug: (slug: string) => api.get(`/games/${slug}`),
    getGenres: () => api.get('/games/genres'),
    create: (data: any) => api.post('/games', data),
    update: (id: string, data: any) => api.put(`/games/${id}`, data),
};

// Library & Wishlist
export const libraryAPI = {
    getLibrary: () => api.get('/library'),
    updatePlaytime: (gameId: string, minutes: number) => api.put(`/library/${gameId}/playtime`, { minutes }),
    toggleFavorite: (gameId: string) => api.put(`/library/${gameId}/favorite`),
    getWishlist: () => api.get('/wishlist'),
    addToWishlist: (gameId: string) => api.post(`/wishlist/${gameId}`),
    removeFromWishlist: (gameId: string) => api.delete(`/wishlist/${gameId}`),
    purchase: (data: any) => api.post('/purchase', data),
};

// Download
export const downloadAPI = {
    getLink: (gameId: string) => api.get(`/download/${gameId}`),
    checkUpdate: (gameId: string, version: string) => api.get(`/download/${gameId}/check-update`, { params: { currentVersion: version } }),
};

// Reviews
export const reviewsAPI = {
    getForGame: (gameId: string, params?: any) => api.get(`/reviews/game/${gameId}`, { params }),
    create: (data: any) => api.post('/reviews', data),
    like: (id: string) => api.post(`/reviews/${id}/like`),
    dislike: (id: string) => api.post(`/reviews/${id}/dislike`),
};

// Friends
export const friendsAPI = {
    getAll: () => api.get('/friends'),
    getRequests: () => api.get('/friends/requests'),
    search: (q: string) => api.get('/friends/search', { params: { q } }),
    sendRequest: (userId: string) => api.post('/friends/request', { userId }),
    accept: (requestId: string) => api.put(`/friends/accept/${requestId}`),
    decline: (requestId: string) => api.put(`/friends/decline/${requestId}`),
    block: (userId: string) => api.put(`/friends/block/${userId}`),
    unfriend: (userId: string) => api.delete(`/friends/${userId}`),
};

// Chat
export const chatAPI = {
    getConversations: () => api.get('/chat/conversations'),
    getHistory: (userId: string) => api.get(`/chat/${userId}`),
    send: (data: any) => api.post('/chat/send', data),
    markRead: (roomId: string) => api.put(`/chat/read/${roomId}`),
};

// Achievements
export const achievementsAPI = {
    getForGame: (gameId: string) => api.get(`/achievements/game/${gameId}`),
    getUserAchievements: () => api.get('/achievements/user'),
    unlock: (achievementId: string) => api.post('/achievements/unlock', { achievementId }),
};

// Notifications
export const notificationsAPI = {
    getAll: (params?: any) => api.get('/notifications', { params }),
    markRead: (id: string) => api.put(`/notifications/${id}/read`),
    markAllRead: () => api.put('/notifications/read-all'),
};

// Mods
export const modsAPI = {
    getForGame: (gameId: string, params?: any) => api.get(`/mods/game/${gameId}`, { params }),
    create: (data: any) => api.post('/mods', data),
    download: (id: string) => api.post(`/mods/${id}/download`),
};

// DLC
export const dlcAPI = {
    getForGame: (gameId: string) => api.get(`/dlc/game/${gameId}`),
    purchase: (id: string, data?: any) => api.post(`/dlc/${id}/purchase`, data),
    download: (id: string) => api.get(`/dlc/${id}/download`),
};

// AI
export const aiAPI = {
    recommend: () => api.post('/ai/recommend'),
    chatbot: (message: string) => api.post('/ai/chatbot', { message }),
};

// Developer
export const developerAPI = {
    register: (data: any) => api.post('/developer/register', data),
    getAccount: () => api.get('/developer/me'),
    getAnalytics: () => api.get('/developer/analytics'),
    uploadGame: (data: any) => api.post('/developer/games', data),
};

// Admin
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getDashboardStats: () => api.get('/admin/stats'),
    getUsers: (params?: any) => api.get('/admin/users', { params }),
    updateUserRole: (userId: string, role: string) => api.put(`/admin/users/${userId}/role`, { role }),
    deleteUser: (userId: string) => api.delete(`/admin/users/${userId}`),
    banUser: (userId: string, reason: string) => api.put(`/admin/ban/${userId}`, { reason }),
    unbanUser: (userId: string) => api.put(`/admin/unban/${userId}`),
    getAllGames: (params?: any) => api.get('/games', { params: { limit: 100, ...params } }),
    removeGame: (id: string) => api.delete(`/admin/games/${id}`),
    updateGame: (id: string, data: any) => api.put(`/admin/games/${id}`, data),
    toggleFeature: (id: string) => api.put(`/admin/games/${id}/feature`),
    addGame: (data: any) => api.post('/admin/games', data),
};

export default api;
