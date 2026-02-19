'use client';
import { useEffect, useState } from 'react';
import { developerAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function DeveloperPage() {
    const { user } = useAuthStore();
    const [account, setAccount] = useState<any>(null);
    const [analytics, setAnalytics] = useState<any>(null);
    const [form, setForm] = useState({ studioName: '', description: '', website: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        developerAPI.getAccount().then(r => { setAccount(r.data.developer); setLoading(false); })
            .catch(() => setLoading(false));
        developerAPI.getAnalytics().then(r => setAnalytics(r.data)).catch(console.error);
    }, []);

    const register = async () => {
        try {
            const { data } = await developerAPI.register(form);
            setAccount(data.developer);
            toast.success('Developer account created!');
        } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
    };

    if (loading) return <div className="shimmer h-64 rounded-xl" />;

    if (!account) return (
        <div className="mx-auto max-w-lg space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Developer Portal</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">Publish and manage your games</p>
            </div>
            <div className="glass-card p-6 space-y-4">
                <p className="text-sm text-[var(--text-secondary)]">Register as a developer to publish and manage your games on Nexus.</p>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Studio Name</label>
                    <input value={form.studioName} onChange={e => setForm(f => ({ ...f, studioName: e.target.value }))} className="input-dark" placeholder="Your studio name" />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Description</label>
                    <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input-dark resize-none" placeholder="Tell us about your studio" />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Website</label>
                    <input value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} className="input-dark" placeholder="https://yourstudio.com" />
                </div>
                <button onClick={register} className="btn-primary w-full">Register as Developer</button>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">{account.studioName}</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{account.verified ? '✅ Verified Studio' : '⏳ Pending Verification'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                    { label: 'Total Games', value: account.games?.length || 0, accent: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
                    { label: 'Downloads', value: analytics?.totalDownloads?.toLocaleString() || '0', accent: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
                    { label: 'Reviews', value: analytics?.totalReviews || '0', accent: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
                    { label: 'Revenue', value: `₹${analytics?.totalRevenue || 0}`, accent: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/20' },
                ].map((s, i) => (
                    <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
                        className={`stat-card border ${s.bg}`}
                    >
                        <span className={`text-xs font-medium ${s.accent}`}>{s.label}</span>
                        <div className="mt-2 text-2xl font-bold">{s.value}</div>
                    </motion.div>
                ))}
            </div>

            <div className="glass-card p-5">
                <h2 className="font-semibold mb-4">Your Games</h2>
                {analytics?.games?.length > 0 ? analytics.games.map((g: any) => (
                    <div key={g._id} className="flex items-center justify-between border-b border-[var(--border)] py-3 last:border-0">
                        <div className="flex items-center gap-3">
                            <img src={g.coverImage} alt="" className="h-12 w-9 rounded-lg object-cover ring-1 ring-[var(--border)]" />
                            <div>
                                <h3 className="text-sm font-semibold">{g.title}</h3>
                                <p className="text-xs text-[var(--text-muted)]">{g.totalDownloads?.toLocaleString()} downloads</p>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-sm text-amber-400">⭐ {g.averageRating?.toFixed(1)}</div>
                            <div className="text-xs text-[var(--text-muted)]">{g.price === 0 ? 'Free' : `₹${g.price}`}</div>
                        </div>
                    </div>
                )) : <p className="text-sm text-[var(--text-muted)]">No games published yet.</p>}
            </div>
        </div>
    );
}
