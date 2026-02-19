'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { adminAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Tab = 'dashboard' | 'users' | 'games' | 'add-game';

const defaultForm = {
    title: '', description: '', price: '0', coverImage: '', downloadUrl: '',
    genres: 'Action', isFeatured: false, discountPercent: '0',
};

const STAT_ICONS: Record<string, string> = {
    users: '👥', games: '🎮', downloads: '⬇️', revenue: '💰',
};

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: string; color: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -4 }}
            transition={{ duration: 0.35 }}
            className="stat-card group"
        >
            <div className={`absolute top-0 left-0 right-0 h-[2px] rounded-t-2xl bg-gradient-to-r ${color}`} />
            <div className="flex items-start justify-between mb-4">
                <div className={`text-2xl p-2.5 rounded-xl bg-gradient-to-br ${color} bg-opacity-10 border border-white/5`}>{icon}</div>
                <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-widest font-semibold">{label}</div>
            </div>
            <div className="text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">{value}</div>
        </motion.div>
    );
}

export default function AdminPage() {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [tab, setTab] = useState<Tab>('dashboard');
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState<any[]>([]);
    const [games, setGames] = useState<any[]>([]);
    const [loadingData, setLoadingData] = useState(false);
    const [form, setForm] = useState(defaultForm);
    const [submitting, setSubmitting] = useState(false);
    const [searchUser, setSearchUser] = useState('');

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/login'); return;
        }
        loadData();
    }, [isAuthenticated, user]);

    const loadData = async () => {
        setLoadingData(true);
        try {
            const [s, u, g] = await Promise.all([
                adminAPI.getDashboardStats(),
                adminAPI.getUsers(),
                adminAPI.getAllGames(),
            ]);
            setStats(s.data);
            setUsers(u.data.users || []);
            setGames((g.data.games || g.data || []).filter((game: any) => game && game._id));
        } catch { toast.error('Failed to load data'); }
        setLoadingData(false);
    };

    const handleToggleRole = async (id: string, role: string) => {
        try {
            const newRole = role === 'admin' ? 'user' : 'admin';
            await adminAPI.updateUserRole(id, newRole);
            setUsers(u => u.map(x => x._id === id ? { ...x, role: newRole } : x));
            toast.success('Role updated');
        } catch { toast.error('Failed to update role'); }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Delete this user?')) return;
        try {
            await adminAPI.deleteUser(id);
            setUsers(u => u.filter(x => x._id !== id));
            toast.success('User deleted');
        } catch { toast.error('Failed to delete'); }
    };

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await adminAPI.updateGame?.(id, { isFeatured: !current });
            setGames(g => g.map(x => x._id === id ? { ...x, isFeatured: !current } : x));
            toast.success(!current ? '⭐ Marked as featured' : 'Removed from featured');
        } catch { toast.error('Failed to update'); }
    };

    const handleDeleteGame = async (id: string) => {
        if (!confirm('Delete this game?')) return;
        try {
            await adminAPI.removeGame(id);
            setGames(g => g.filter(x => x._id !== id));
            toast.success('Game deleted');
        } catch { toast.error('Failed to delete'); }
    };

    const handleAddGame = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await adminAPI.addGame({
                ...form,
                price: parseFloat(form.price),
                discountPercent: parseInt(form.discountPercent),
                genres: [form.genres],
            });
            toast.success('🎮 Game published!');
            setForm(defaultForm);
            setTab('games');
            loadData();
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to add game');
        }
        setSubmitting(false);
    };

    const TABS: { id: Tab; label: string; icon: string }[] = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'users', label: `Users${users.length ? ` (${users.length})` : ''}`, icon: '👥' },
        { id: 'games', label: `Games${games.length ? ` (${games.length})` : ''}`, icon: '🎮' },
        { id: 'add-game', label: 'Add Game', icon: '➕' },
    ];

    const filteredUsers = users.filter(u =>
        u.username?.toLowerCase().includes(searchUser.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchUser.toLowerCase())
    );

    return (
        <div className="space-y-6 relative pb-10">
            {/* Background */}
            <div className="absolute inset-0 grid-lines opacity-20 pointer-events-none" />
            <div className="ambient-glow bg-violet-600 -top-40 -right-40 pointer-events-none" />

            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative z-10">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold flex items-center gap-3" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                            <span className="gradient-text">NEXUS</span>
                            <span className="text-[var(--text-secondary)] font-medium text-2xl">Admin</span>
                        </h1>
                        <p className="text-sm text-[var(--text-muted)] mt-0.5">
                            Welcome back, <span className="text-[var(--accent-light)] font-medium">{user?.username}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-3 py-2">
                        <span className="online-dot" />
                        Admin Online
                    </div>
                </div>
            </motion.div>

            {/* Tabs */}
            <div className="relative z-10 flex gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-card)] p-1.5 overflow-x-auto no-scrollbar">
                {TABS.map((t, i) => (
                    <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all duration-200 ${tab === t.id
                            ? 'text-white shadow-lg'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
                            }`}
                    >
                        {tab === t.id && (
                            <motion.div
                                layoutId="admin-tab"
                                className="absolute inset-0 rounded-xl"
                                style={{ background: 'var(--grad-accent)' }}
                                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                            />
                        )}
                        <span className="relative z-10">{t.icon}</span>
                        <span className="relative z-10">{t.label}</span>
                    </button>
                ))}
            </div>

            {/* Content */}
            <AnimatePresence mode="wait">
                {/* ── DASHBOARD ── */}
                {tab === 'dashboard' && (
                    <motion.div key="dashboard"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6 relative z-10"
                    >
                        {loadingData ? (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[...Array(4)].map((_, i) => <div key={i} className="shimmer h-32 rounded-2xl" />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {[
                                    { label: 'Total Users', value: stats?.totalUsers ?? users.length, icon: '👥', color: 'from-violet-500 to-indigo-600' },
                                    { label: 'Total Games', value: stats?.totalGames ?? games.length, icon: '🎮', color: 'from-cyan-500 to-blue-600' },
                                    { label: 'Downloads', value: stats?.totalDownloads ?? '—', icon: '⬇️', color: 'from-emerald-500 to-teal-600' },
                                    { label: 'Revenue', value: stats?.totalRevenue ? `₹${stats.totalRevenue.toLocaleString()}` : '₹0', icon: '💰', color: 'from-amber-500 to-orange-600' },
                                ].map((s, i) => (
                                    <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                                        <StatCard {...s} />
                                    </motion.div>
                                ))}
                            </div>
                        )}

                        {/* Quick actions */}
                        <div className="glass-card p-6">
                            <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {[
                                    { label: 'Add Game', icon: '🎮', onClick: () => setTab('add-game'), color: 'hover:border-violet-500/40 hover:bg-violet-500/5' },
                                    { label: 'Manage Users', icon: '👥', onClick: () => setTab('users'), color: 'hover:border-cyan-500/40 hover:bg-cyan-500/5' },
                                    { label: 'View Games', icon: '📋', onClick: () => setTab('games'), color: 'hover:border-emerald-500/40 hover:bg-emerald-500/5' },
                                    { label: 'Refresh', icon: '🔄', onClick: loadData, color: 'hover:border-amber-500/40 hover:bg-amber-500/5' },
                                ].map(a => (
                                    <motion.button key={a.label} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                        onClick={a.onClick}
                                        className={`flex flex-col items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-4 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 ${a.color}`}
                                    >
                                        <span className="text-2xl">{a.icon}</span>
                                        {a.label}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* Recent activity feed */}
                        <div className="glass-card p-6">
                            <h2 className="text-sm font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-4">Recent Users</h2>
                            <div className="space-y-2">
                                {users.slice(0, 5).map((u, i) => (
                                    <motion.div key={u._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
                                        className="flex items-center gap-3 rounded-xl p-3 border border-[var(--border)] bg-[var(--bg-elevated)] hover:border-[var(--border-bright)] transition-colors"
                                    >
                                        <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="h-8 w-8 rounded-full ring-2 ring-[var(--border)]" alt="" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium truncate">{u.username}</p>
                                            <p className="text-xs text-[var(--text-muted)] truncate">{u.email}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400' : u.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-violet-500/20 text-violet-400'}`}>
                                            {u.role}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── USERS ── */}
                {tab === 'users' && (
                    <motion.div key="users"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 relative z-10"
                    >
                        {/* Search */}
                        <div className="relative">
                            <svg className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            <input
                                value={searchUser} onChange={e => setSearchUser(e.target.value)}
                                placeholder="Search users by name or email..."
                                className="input pl-11"
                            />
                        </div>

                        <div className="glass-card overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                            {['User', 'Email', 'Role', 'Joined', 'Actions'].map(h => (
                                                <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((u, i) => (
                                            <motion.tr key={u._id}
                                                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                                                className="border-b border-[var(--border)] last:border-0 transition-colors hover:bg-[var(--bg-hover)] group"
                                            >
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`} className="h-8 w-8 rounded-full ring-2 ring-[var(--border)] group-hover:ring-[var(--accent)] transition-all" alt="" />
                                                        <span className="font-medium text-[var(--text-primary)]">{u.username}</span>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3.5 text-[var(--text-secondary)]">{u.email}</td>
                                                <td className="px-4 py-3.5">
                                                    <span className={`badge ${u.role === 'admin' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/20' : u.role === 'developer' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/20' : 'bg-violet-500/20 text-violet-400 border border-violet-500/20'}`}>
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3.5 text-[var(--text-muted)] text-xs mono">
                                                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                                                </td>
                                                <td className="px-4 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={() => handleToggleRole(u._id, u.role)}
                                                            className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-amber-500/40 hover:bg-amber-500/10 hover:text-amber-400 transition-all">
                                                            Toggle Admin
                                                        </button>
                                                        <button onClick={() => handleDeleteUser(u._id)}
                                                            className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all">
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-12 text-[var(--text-muted)]">
                                        <div className="text-3xl mb-2">🔍</div>
                                        <p className="text-sm">No users found</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* ── GAMES ── */}
                {tab === 'games' && (
                    <motion.div key="games"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-4 relative z-10"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-[var(--text-muted)]">{games.length} game{games.length !== 1 ? 's' : ''} in the platform</p>
                            <button onClick={() => setTab('add-game')} className="btn-primary text-sm py-2 px-4 flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                                New Game
                            </button>
                        </div>

                        {games.length === 0 ? (
                            <div className="glass-card p-16 text-center">
                                <div className="text-5xl mb-4 animate-bounce-subtle">🎮</div>
                                <h3 className="font-semibold text-lg mb-1">No games yet</h3>
                                <p className="text-[var(--text-muted)] text-sm mb-5">Start building your library</p>
                                <button onClick={() => setTab('add-game')} className="btn-primary py-2.5 px-6">Publish First Game</button>
                            </div>
                        ) : (
                            <div className="glass-card overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--border)] bg-[var(--bg-elevated)]">
                                                {['Game', 'Price', 'Downloads', 'Featured', 'Actions'].map(h => (
                                                    <th key={h} className="px-4 py-3.5 text-left text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest">{h}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {games.map((g, i) => (
                                                <motion.tr key={g._id}
                                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                                    className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)] group transition-colors"
                                                >
                                                    <td className="px-4 py-3.5">
                                                        <div className="flex items-center gap-3">
                                                            <div className="h-10 w-8 rounded-lg overflow-hidden bg-[var(--bg-elevated)] shrink-0 ring-1 ring-[var(--border)] group-hover:ring-[var(--accent)] transition-all">
                                                                {g.coverImage
                                                                    ? <img src={g.coverImage} alt="" className="h-full w-full object-cover" />
                                                                    : <div className="h-full w-full flex items-center justify-center text-xs">🎮</div>
                                                                }
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-[var(--text-primary)] leading-snug">{g.title}</p>
                                                                <p className="text-[11px] text-[var(--text-muted)]">{g.genres?.slice(0, 2).join(', ')}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        {g.price === 0
                                                            ? <span className="text-emerald-400 font-bold text-xs">FREE</span>
                                                            : <span className="font-semibold">₹{g.price}</span>
                                                        }
                                                    </td>
                                                    <td className="px-4 py-3.5 text-[var(--text-muted)]">
                                                        {g.totalDownloads > 1000
                                                            ? `${(g.totalDownloads / 1000).toFixed(0)}K`
                                                            : g.totalDownloads || 0}
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <button onClick={() => handleToggleFeatured(g._id, g.isFeatured)}
                                                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${g.isFeatured ? 'bg-violet-500' : 'bg-[var(--bg-elevated)] border border-[var(--border)]'}`}>
                                                            <span className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow-md transition-transform ${g.isFeatured ? 'translate-x-4.5' : 'translate-x-0.5'}`} style={{ transform: g.isFeatured ? 'translateX(18px)' : 'translateX(2px)' }} />
                                                        </button>
                                                    </td>
                                                    <td className="px-4 py-3.5">
                                                        <button onClick={() => handleDeleteGame(g._id)}
                                                            className="text-xs px-2.5 py-1 rounded-lg border border-[var(--border)] text-[var(--text-secondary)] hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400 transition-all">
                                                            Delete
                                                        </button>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* ── ADD GAME ── */}
                {tab === 'add-game' && (
                    <motion.div key="add-game"
                        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                        className="relative z-10"
                    >
                        <form onSubmit={handleAddGame} className="glass-card p-7 max-w-2xl space-y-6">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'var(--grad-accent)' }}>🎮</div>
                                <div>
                                    <h2 className="font-bold text-lg">Publish New Game</h2>
                                    <p className="text-xs text-[var(--text-muted)]">Fill out the details to add a game to the platform</p>
                                </div>
                            </div>

                            <div className="divider" />

                            <div className="grid gap-5 md:grid-cols-2">
                                {[
                                    { key: 'title', label: 'Title *', placeholder: 'Game title', type: 'text' },
                                    { key: 'price', label: 'Price (₹)', placeholder: '0 for free', type: 'number' },
                                    { key: 'coverImage', label: 'Cover Image URL *', placeholder: 'https://...', type: 'url' },
                                    { key: 'downloadUrl', label: 'Download URL *', placeholder: 'https://drive.google.com/...', type: 'url' },
                                    { key: 'discountPercent', label: 'Discount %', placeholder: '0', type: 'number' },
                                ].map(f => (
                                    <div key={f.key} className="input-group">
                                        <label>{f.label}</label>
                                        <input
                                            type={f.type} placeholder={f.placeholder}
                                            value={(form as any)[f.key]}
                                            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                                            className="input"
                                        />
                                    </div>
                                ))}

                                <div className="input-group">
                                    <label>Genre</label>
                                    <select value={form.genres} onChange={e => setForm(p => ({ ...p, genres: e.target.value }))} className="input select">
                                        {['Action', 'RPG', 'Strategy', 'Racing', 'Horror', 'Indie', 'FPS', 'MMO', 'Adventure', 'Sports'].map(g => (
                                            <option key={g} value={g}>{g}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Description *</label>
                                <textarea
                                    rows={3} placeholder="Write a compelling game description..."
                                    value={form.description}
                                    onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                                    className="input resize-none"
                                />
                            </div>

                            <label className="flex items-center gap-3 cursor-pointer select-none group">
                                <div
                                    onClick={() => setForm(p => ({ ...p, isFeatured: !p.isFeatured }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer ${form.isFeatured ? 'bg-violet-500' : 'bg-[var(--bg-elevated)] border border-[var(--border)]'}`}
                                >
                                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${form.isFeatured ? 'translate-x-6' : 'translate-x-1'}`} />
                                </div>
                                <span className="text-sm text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">Mark as Featured ⭐</span>
                            </label>

                            <div className="flex gap-3 pt-2">
                                <motion.button
                                    type="submit" disabled={submitting}
                                    whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                                    className="btn-primary flex-1 py-3 disabled:opacity-60 flex items-center justify-center gap-2"
                                >
                                    {submitting ? (
                                        <>
                                            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Publishing...
                                        </>
                                    ) : '🚀 Publish Game'}
                                </motion.button>
                                <button type="button" onClick={() => { setForm(defaultForm); setTab('games'); }} className="btn-secondary px-6">
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
