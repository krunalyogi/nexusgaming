'use client';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import GameCard from '@/components/GameCard';
import { gamesAPI } from '@/lib/api';

export default function StorePage() {
    const searchParams = useSearchParams();
    const [games, setGames] = useState<any[]>([]);
    const [search, setSearch] = useState(searchParams.get('search') || '');
    const [genre, setGenre] = useState(searchParams.get('genre') || '');
    const [sort, setSort] = useState('-createdAt');
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 12;

    useEffect(() => {
        setLoading(true);
        const params: any = { page, limit, sort };
        if (search) params.search = search;
        if (genre) params.genre = genre;
        gamesAPI.getAll(params).then(r => { setGames(r.data.games || []); setTotal(r.data.total || 0); setLoading(false); })
            .catch(() => setLoading(false));
    }, [search, genre, sort, page]);

    const genres = ['all', 'action', 'rpg', 'adventure', 'strategy', 'racing', 'fighting', 'simulation', 'sports', 'mmo', 'survival', 'sandbox', 'indie'];

    return (
        <div className="space-y-6 relative">
            <div className="ambient-glow bg-indigo-600 -top-40 right-0" />

            <div>
                <h1 className="text-2xl font-bold">Game Store</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">Discover your next favorite game</p>
            </div>

            {/* Filters */}
            <div className="glass-card p-4">
                <div className="flex flex-col gap-3 md:flex-row">
                    <div className="relative flex-1">
                        <svg className="absolute left-3 top-3 h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search games..." className="input pl-10" />
                    </div>
                    <select value={sort} onChange={e => setSort(e.target.value)} className="input w-auto min-w-[160px] cursor-pointer">
                        <option value="-createdAt">Newest First</option>
                        <option value="-averageRating">Highest Rated</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="-totalDownloads">Most Downloaded</option>
                    </select>
                </div>

                {/* Genre Tags */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                    {genres.map(g => (
                        <button key={g} onClick={() => { setGenre(g === 'all' ? '' : g); setPage(1); }}
                            className={`rounded-lg px-3 py-1.5 text-xs font-medium capitalize transition-all duration-200 ${(g === 'all' && !genre) || g === genre
                                ? 'bg-[var(--accent)] text-white shadow-lg shadow-violet-500/25'
                                : 'bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)] hover:border-[var(--accent)]'
                                }`}
                        >{g}</button>
                    ))}
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {[...Array(10)].map((_, i) => <div key={i} className="shimmer aspect-[3/4] rounded-xl" />)}
                </div>
            ) : games.length === 0 ? (
                <div className="glass-card flex flex-col items-center justify-center p-16 text-center">
                    <span className="text-4xl mb-3">🔍</span>
                    <h3 className="text-lg font-semibold">No games found</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">Try adjusting your filters</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {games.map((game, i) => (
                        <motion.div key={game._id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                            <GameCard game={game} />
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {total > limit && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="btn-ghost text-sm py-2 px-4 disabled:opacity-30">← Previous</button>
                    <span className="px-4 text-sm text-[var(--text-muted)]">Page {page} of {Math.ceil(total / limit)}</span>
                    <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.ceil(total / limit)} className="btn-ghost text-sm py-2 px-4 disabled:opacity-30">Next →</button>
                </div>
            )}
        </div>
    );
}
