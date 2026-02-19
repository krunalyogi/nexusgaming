'use client';
import { useAuthStore } from '@/store/authStore';
import { useState } from 'react';
import { authAPI } from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [bio, setBio] = useState(user?.bio || '');
    const [country, setCountry] = useState(user?.country || '');

    const save = async () => {
        try {
            const { data } = await authAPI.updateProfile({ bio, country });
            setUser(data.user);
            toast.success('Profile updated!');
        } catch { toast.error('Failed to update'); }
    };

    if (!user) return (
        <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <span className="text-4xl mb-3">👤</span>
            <h3 className="text-lg font-semibold">Please log in</h3>
            <p className="text-sm text-[var(--text-muted)] mt-1">Sign in to view your profile</p>
        </div>
    );

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6 flex items-center gap-6"
            >
                <img src={user.avatar} alt="" className="h-20 w-20 rounded-full ring-4 ring-[var(--accent)]/20 shadow-lg" />
                <div>
                    <h1 className="text-2xl font-bold">{user.username}</h1>
                    <p className="text-sm text-[var(--text-muted)]">{user.email}</p>
                    <div className="mt-2 flex gap-2">
                        <span className="badge bg-[var(--accent)]/10 text-[var(--accent-light)] border border-[var(--accent)]/20">Level {user.steamLevel}</span>
                        <span className="badge bg-[var(--bg-elevated)] text-[var(--text-muted)] border border-[var(--border)] capitalize">{user.role}</span>
                    </div>
                </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="glass-card p-6 space-y-4"
            >
                <h2 className="text-base font-semibold">Edit Profile</h2>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Bio</label>
                    <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3} className="input-dark resize-none" placeholder="Tell us about yourself..." />
                </div>
                <div>
                    <label className="mb-1.5 block text-xs font-medium text-[var(--text-secondary)]">Country</label>
                    <input value={country} onChange={e => setCountry(e.target.value)} className="input-dark" placeholder="Your country" />
                </div>
                <button onClick={save} className="btn-primary">Save Changes</button>
            </motion.div>
        </div>
    );
}
