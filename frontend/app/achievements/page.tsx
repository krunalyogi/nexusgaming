'use client';
import { useEffect, useState } from 'react';
import { achievementsAPI } from '@/lib/api';
import { motion } from 'framer-motion';

export default function AchievementsPage() {
    const [achievements, setAchievements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        achievementsAPI.getMy().then(r => { setAchievements(r.data.achievements || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const totalPoints = achievements.reduce((acc: number, a: any) => acc + (a.achievement?.points || 0), 0);
    const rarityColor = (r: string) => ({ common: 'text-gray-400 bg-gray-500/10 border-gray-500/20', uncommon: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', rare: 'text-blue-400 bg-blue-500/10 border-blue-500/20', legendary: 'text-amber-400 bg-amber-500/10 border-amber-500/20' }[r] || 'text-gray-400 bg-gray-500/10');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Achievements</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{achievements.length} unlocked</p>
                </div>
                <div className="stat-card border border-amber-500/20 bg-amber-500/5 px-5 py-2.5">
                    <span className="text-sm text-[var(--text-muted)]">Total Points</span>
                    <span className="ml-2 text-lg font-bold gradient-text-gold">{totalPoints}</span>
                </div>
            </div>

            {loading ? (
                <div className="grid gap-3 md:grid-cols-2">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-24 rounded-xl" />)}</div>
            ) : achievements.length === 0 ? (
                <div className="glass-card flex flex-col items-center p-16 text-center">
                    <span className="text-4xl mb-3">🏆</span>
                    <h3 className="text-lg font-semibold">No achievements yet</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Play games to unlock achievements</p>
                </div>
            ) : (
                <div className="grid gap-2 md:grid-cols-2">
                    {achievements.map((a, i) => (
                        <motion.div key={a._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-4 transition hover:border-[var(--border-glow)]"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--bg-elevated)] text-2xl">{a.achievement?.icon || '🏆'}</div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-sm">{a.achievement?.title}</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5 truncate">{a.achievement?.description}</p>
                                <p className="text-[11px] text-[var(--text-muted)] mt-1">{a.achievement?.game?.title} • {new Date(a.unlockedAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                                <div className="text-sm font-bold gradient-text-gold">+{a.achievement?.points}</div>
                                <span className={`badge mt-1 border text-[10px] ${rarityColor(a.achievement?.rarity)}`}>{a.achievement?.rarity}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
