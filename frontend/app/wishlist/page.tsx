'use client';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { libraryAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function WishlistPage() {
    const { user, setUser } = useAuthStore();
    const [games, setGames] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        libraryAPI.getWishlist().then(r => { setGames(r.data.wishlist || []); setLoading(false); }).catch(() => setLoading(false));
    }, []);

    const remove = async (gameId: string) => {
        await libraryAPI.removeFromWishlist(gameId);
        setGames(g => g.filter(x => x._id !== gameId));
        toast.success('Removed from wishlist');
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Wishlist</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{games.length} games saved</p>
            </div>

            {loading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
            ) : games.length === 0 ? (
                <div className="glass-card flex flex-col items-center p-16 text-center">
                    <span className="text-4xl mb-3">💜</span>
                    <h3 className="text-lg font-semibold">Wishlist is empty</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1 mb-4">Save games you want to play later</p>
                    <Link href="/store" className="btn-primary">Browse Store</Link>
                </div>
            ) : (
                <div className="space-y-2">
                    {games.map((g, i) => (
                        <motion.div key={g._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                            className="flex items-center gap-4 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 transition hover:border-[var(--border-glow)] group"
                        >
                            <Link href={`/games/${g.slug}`} className="flex items-center gap-4 flex-1 min-w-0">
                                <img src={g.coverImage} alt="" className="h-16 w-12 rounded-lg object-cover ring-1 ring-[var(--border)]" />
                                <div className="min-w-0">
                                    <h3 className="font-semibold text-sm truncate group-hover:text-[var(--accent-light)] transition-colors">{g.title}</h3>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1"><svg className="h-3 w-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>{g.averageRating?.toFixed(1)}</span>
                                        {g.genres?.slice(0, 2).map((genre: string) => <span key={genre} className="tag text-[10px]">{genre}</span>)}
                                    </div>
                                </div>
                            </Link>
                            <div className="flex items-center gap-3 flex-shrink-0">
                                <span className="text-sm font-bold">{g.price === 0 ? <span className="text-emerald-400">Free</span> : `₹${g.price}`}</span>
                                <button onClick={() => remove(g._id)} className="rounded-lg bg-red-500/10 p-2 text-red-400 transition hover:bg-red-500/20">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
