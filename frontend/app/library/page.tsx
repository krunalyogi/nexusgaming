'use client';
import { useEffect, useState } from 'react';
import { libraryAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LibraryPage() {
    const [library, setLibrary] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        libraryAPI.getLibrary().then(r => { setLibrary(r.data.library || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">My Library</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{library.length} games in your collection</p>
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(4)].map((_, i) => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
            ) : library.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
                    <span className="text-4xl mb-3">📚</span>
                    <h3 className="text-lg font-semibold">Your library is empty</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">Browse the store to find games</p>
                    <Link href="/store" className="btn-primary">Browse Store</Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {library.map((entry, i) => (
                        <motion.div key={entry._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
                            <Link href={`/games/${entry.game?.slug}`} className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 transition hover:border-[var(--border-glow)] hover:bg-[var(--bg-hover)] group">
                                <img src={entry.game?.coverImage} alt="" className="h-16 w-12 rounded-lg object-cover ring-1 ring-[var(--border)]" />
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-semibold truncate group-hover:text-[var(--accent-light)] transition-colors">{entry.game?.title}</h3>
                                    <div className="mt-1 flex items-center gap-3 text-xs text-[var(--text-muted)]">
                                        <span>⏱ {entry.playtime ? `${Math.round(entry.playtime / 60)}h played` : 'Not played yet'}</span>
                                        {entry.lastPlayed && <span>• Last: {new Date(entry.lastPlayed).toLocaleDateString()}</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {entry.installed && <span className="badge bg-emerald-500/15 text-emerald-400 text-[10px]">Installed</span>}
                                    <svg className="h-4 w-4 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
