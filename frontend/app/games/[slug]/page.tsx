'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { gamesAPI, reviewsAPI, downloadAPI, libraryAPI, dlcAPI, modsAPI, achievementsAPI } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export default function GameDetailPage() {
    const { slug } = useParams();
    const { user, isAuthenticated } = useAuthStore();
    const [game, setGame] = useState<any>(null);
    const [reviews, setReviews] = useState<any[]>([]);
    const [dlcs, setDlcs] = useState<any[]>([]);
    const [mods, setMods] = useState<any[]>([]);
    const [achievements, setAchievements] = useState<any[]>([]);
    const [tab, setTab] = useState('about');
    const [loading, setLoading] = useState(true);
    const [reviewForm, setReviewForm] = useState({ rating: 5, title: '', content: '' });

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await gamesAPI.getBySlug(slug as string);
                setGame(data.game);
                const [r, d, m, a] = await Promise.all([
                    reviewsAPI.getForGame(data.game._id),
                    dlcAPI.getForGame(data.game._id),
                    modsAPI.getForGame(data.game._id),
                    achievementsAPI.getForGame(data.game._id),
                ]);
                setReviews(r.data.reviews || []);
                setDlcs(d.data.dlcs || []);
                setMods(m.data.mods || []);
                setAchievements(a.data.achievements || []);
            } catch (e) { console.error(e); }
            setLoading(false);
        };
        load();
    }, [slug]);

    const handleDownload = async () => {
        if (!isAuthenticated) return toast.error('Please login first');
        try {
            if (game.price > 0) {
                await libraryAPI.purchase({ gameId: game._id });
                toast.success('Purchased! Starting download...');
            }
            const { data } = await downloadAPI.getLink(game._id);
            window.open(data.downloadUrl, '_blank');
            toast.success('Download started!');
        } catch (err: any) { toast.error(err.response?.data?.error || 'Download failed'); }
    };

    const handleAddWishlist = async () => {
        if (!isAuthenticated) return toast.error('Please login first');
        try {
            await libraryAPI.addToWishlist(game._id);
            toast.success('Added to wishlist!');
        } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await reviewsAPI.create({ gameId: game._id, ...reviewForm, isRecommended: reviewForm.rating >= 3 });
            toast.success('Review posted!');
            const { data } = await reviewsAPI.getForGame(game._id);
            setReviews(data.reviews);
        } catch (err: any) { toast.error(err.response?.data?.error || 'Failed'); }
    };

    if (loading) return <div className="flex h-64 items-center justify-center"><div className="shimmer h-10 w-40 rounded-lg" /></div>;
    if (!game) return <div className="p-12 text-center text-dark-200">Game not found 😔</div>;

    const tabs = ['about', 'reviews', 'dlc', 'mods', 'achievements'];

    return (
        <div className="space-y-6">
            {/* Banner */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative h-64 overflow-hidden rounded-2xl md:h-80">
                <img src={game.bannerImage || game.coverImage} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/50 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                    <h1 className="text-3xl font-black md:text-4xl">{game.title}</h1>
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className="flex items-center gap-1"><span className="text-yellow-400">⭐</span> {game.averageRating.toFixed(1)}</span>
                        <span className="text-dark-200">|</span>
                        <span className="text-dark-200">{game.totalReviews} reviews</span>
                        <span className="text-dark-200">|</span>
                        <span className="text-dark-200">{game.totalDownloads?.toLocaleString()} downloads</span>
                        {game.isEarlyAccess && <span className="rounded-full bg-yellow-500/20 px-2 py-0.5 text-xs text-yellow-300">Early Access</span>}
                    </div>
                </div>
            </motion.div>

            <div className="flex flex-col gap-6 lg:flex-row">
                {/* Main Content */}
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex-1 space-y-6">
                    {/* Tabs */}
                    <div className="flex gap-1 rounded-lg bg-dark-700 p-1">
                        {tabs.map(t => (
                            <button key={t} onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition ${tab === t ? 'bg-nexus-500 text-white' : 'text-dark-200 hover:text-white'}`}>{t}</button>
                        ))}
                    </div>

                    {tab === 'about' && (
                        <div className="space-y-4">
                            <p className="text-dark-100 leading-relaxed">{game.description}</p>
                            {game.screenshots?.length > 0 && (
                                <div className="grid grid-cols-2 gap-3">
                                    {game.screenshots.map((s: string, i: number) => <img key={i} src={s} alt="" className="rounded-lg object-cover" />)}
                                </div>
                            )}
                            <div className="rounded-xl bg-dark-700 p-4">
                                <h3 className="mb-3 font-semibold">System Requirements</h3>
                                <div className="grid gap-2 text-sm text-dark-200">
                                    {Object.entries(game.minRequirements || {}).map(([k, v]) => (
                                        <div key={k} className="flex justify-between"><span className="capitalize text-dark-100">{k}</span><span>{v as string}</span></div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {tab === 'reviews' && (
                        <div className="space-y-4">
                            {isAuthenticated && (
                                <form onSubmit={handleSubmitReview} className="rounded-xl bg-dark-700 p-4 space-y-3">
                                    <h3 className="font-semibold">Write a Review</h3>
                                    <div className="flex gap-2">{[1, 2, 3, 4, 5].map(n => <button key={n} type="button" onClick={() => setReviewForm(p => ({ ...p, rating: n }))} className={`text-2xl ${n <= reviewForm.rating ? 'text-yellow-400' : 'text-dark-300'}`}>⭐</button>)}</div>
                                    <input value={reviewForm.title} onChange={(e) => setReviewForm(p => ({ ...p, title: e.target.value }))} placeholder="Review title" required className="w-full rounded-lg bg-dark-800 px-3 py-2 text-white outline-none ring-1 ring-dark-300 focus:ring-nexus-500" />
                                    <textarea value={reviewForm.content} onChange={(e) => setReviewForm(p => ({ ...p, content: e.target.value }))} placeholder="Your review..." required rows={3} className="w-full rounded-lg bg-dark-800 px-3 py-2 text-white outline-none ring-1 ring-dark-300 focus:ring-nexus-500" />
                                    <button type="submit" className="btn-neon text-sm">Submit Review</button>
                                </form>
                            )}
                            {reviews.map((r: any) => (
                                <div key={r._id} className="rounded-xl bg-dark-700 p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={r.user?.avatar} alt="" className="h-8 w-8 rounded-full" />
                                        <div>
                                            <span className="font-medium">{r.user?.username}</span>
                                            <span className="ml-2 text-sm text-yellow-400">{'⭐'.repeat(r.rating)}</span>
                                        </div>
                                    </div>
                                    <h4 className="mt-2 font-semibold">{r.title}</h4>
                                    <p className="mt-1 text-sm text-dark-200">{r.content}</p>
                                    <div className="mt-2 flex gap-3 text-sm text-dark-200">
                                        <button onClick={() => reviewsAPI.like(r._id).then(() => toast.success('Liked!'))} className="hover:text-green-400">👍 {r.likes?.length || 0}</button>
                                        <button onClick={() => reviewsAPI.dislike(r._id).then(() => toast.success('Disliked'))} className="hover:text-red-400">👎 {r.dislikes?.length || 0}</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'dlc' && (
                        <div className="space-y-3">
                            {dlcs.length === 0 ? <p className="text-dark-200">No DLC available yet.</p> : dlcs.map((d: any) => (
                                <div key={d._id} className="flex items-center justify-between rounded-xl bg-dark-700 p-4">
                                    <div>
                                        <h4 className="font-semibold">{d.title}</h4>
                                        <p className="text-sm text-dark-200">{d.description}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-nexus-400">₹{d.price}</div>
                                        <button className="btn-neon mt-1 text-xs" onClick={() => toast.success('DLC Purchase (demo)')}>Buy</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'mods' && (
                        <div className="space-y-3">
                            {mods.length === 0 ? <p className="text-dark-200">No mods available yet.</p> : mods.map((m: any) => (
                                <div key={m._id} className="flex items-center justify-between rounded-xl bg-dark-700 p-4">
                                    <div>
                                        <h4 className="font-semibold">{m.title} <span className="text-xs text-dark-200">v{m.version}</span></h4>
                                        <p className="text-sm text-dark-200">{m.description?.substring(0, 100)}...</p>
                                        <span className="text-xs text-dark-200">📥 {m.totalDownloads} downloads</span>
                                    </div>
                                    <button className="btn-neon text-xs" onClick={() => { modsAPI.download(m._id); toast.success('Downloading mod...'); }}>Download</button>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === 'achievements' && (
                        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                            {achievements.map((a: any) => (
                                <div key={a._id} className={`flex items-center gap-3 rounded-xl p-4 ${a.unlocked ? 'bg-nexus-500/20 border border-nexus-500/30' : 'bg-dark-700'}`}>
                                    <span className="text-3xl">{a.icon}</span>
                                    <div>
                                        <h4 className="font-semibold">{a.title}</h4>
                                        <p className="text-xs text-dark-200">{a.description}</p>
                                        <div className="mt-1 flex items-center gap-2 text-xs">
                                            <span className={`rounded-full px-2 py-0.5 capitalize ${a.rarity === 'legendary' ? 'bg-yellow-500/20 text-yellow-300' : a.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' : a.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' : 'bg-dark-600 text-dark-200'}`}>{a.rarity}</span>
                                            <span className="text-nexus-400">{a.points} pts</span>
                                            {a.unlocked && <span className="text-green-400">✅ Unlocked</span>}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Sidebar */}
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="w-full space-y-4 lg:w-72">
                    <div className="rounded-xl bg-dark-700 p-4">
                        <img src={game.coverImage} alt="" className="mb-4 w-full rounded-lg" />
                        <div className="mb-3">
                            {game.price === 0 ? <span className="text-2xl font-bold text-green-400">Free to Play</span> : (
                                <div className="flex items-center gap-2">
                                    {game.discountPercent > 0 && <span className="rounded bg-green-500 px-2 py-1 text-sm font-bold">-{game.discountPercent}%</span>}
                                    <span className="text-2xl font-bold">₹{Math.round(game.price * (1 - (game.discountPercent || 0) / 100))}</span>
                                    {game.discountPercent > 0 && <span className="text-sm text-dark-200 line-through">₹{game.price}</span>}
                                </div>
                            )}
                        </div>
                        <button onClick={handleDownload} className="btn-neon mb-2 w-full py-3">
                            {game.price === 0 ? '⬇️ Download Free' : '🛒 Buy & Download'}
                        </button>
                        <button onClick={handleAddWishlist} className="w-full rounded-lg border border-dark-300 py-2.5 text-sm font-medium transition hover:border-nexus-500">💝 Add to Wishlist</button>
                    </div>

                    <div className="rounded-xl bg-dark-700 p-4 text-sm">
                        <h3 className="mb-3 font-semibold">Game Info</h3>
                        <div className="space-y-2 text-dark-200">
                            <div className="flex justify-between"><span>Developer</span><span className="text-white">{game.developer?.studioName || game.publisher}</span></div>
                            <div className="flex justify-between"><span>Release</span><span className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</span></div>
                            <div className="flex justify-between"><span>Version</span><span className="text-white">{game.currentVersion}</span></div>
                            <div className="flex justify-between"><span>Size</span><span className="text-white">{game.fileSize}</span></div>
                            <div className="flex justify-between"><span>Rating</span><span className="text-white">{game.ageRating}</span></div>
                            <div className="flex justify-between"><span>Platform</span><span className="text-white">{game.platform?.join(', ')}</span></div>
                        </div>
                    </div>

                    <div className="rounded-xl bg-dark-700 p-4">
                        <h3 className="mb-2 text-sm font-semibold">Tags</h3>
                        <div className="flex flex-wrap gap-1">
                            {game.genres?.map((g: string) => <span key={g} className="rounded-full bg-nexus-500/20 px-2 py-0.5 text-xs text-nexus-300">{g}</span>)}
                            {game.tags?.map((t: string) => <span key={t} className="rounded-full bg-dark-600 px-2 py-0.5 text-xs text-dark-200">{t}</span>)}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
