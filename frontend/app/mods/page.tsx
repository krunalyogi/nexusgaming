'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { gamesAPI } from '@/lib/api';
import Link from 'next/link';

export default function ModsPage() {
    const [games, setGames] = useState<any[]>([]);
    useEffect(() => { gamesAPI.getAll({ limit: 50 }).then(r => setGames(r.data.games || [])).catch(console.error); }, []);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Mod Workshop</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">Browse and install community-made mods</p>
            </div>
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                {games.map((g, i) => (
                    <motion.div key={g._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                        <Link href={`/games/${g.slug}?tab=mods`} className="game-card group block">
                            <div className="relative aspect-video overflow-hidden">
                                <img src={g.coverImage} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                            </div>
                            <div className="p-3">
                                <h3 className="text-sm font-semibold group-hover:text-[var(--accent-light)] transition-colors">{g.title}</h3>
                                <p className="text-xs text-[var(--text-muted)] mt-0.5">Browse mods →</p>
                            </div>
                        </Link>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
