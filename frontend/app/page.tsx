'use client';
import { useEffect, useState, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import GameCard from '@/components/GameCard';
import { gamesAPI } from '@/lib/api';
import Link from 'next/link';

const GENRES = [
    { name: 'Action', icon: '⚡', color: 'from-orange-500/20 to-red-600/10', border: 'border-orange-500/20', glow: 'shadow-orange-500/10', href: 'action' },
    { name: 'RPG', icon: '⚔️', color: 'from-violet-500/20 to-purple-600/10', border: 'border-violet-500/20', glow: 'shadow-violet-500/10', href: 'rpg' },
    { name: 'Strategy', icon: '🧩', color: 'from-emerald-500/20 to-teal-600/10', border: 'border-emerald-500/20', glow: 'shadow-emerald-500/10', href: 'strategy' },
    { name: 'Racing', icon: '🏎️', color: 'from-amber-500/20 to-yellow-600/10', border: 'border-amber-500/20', glow: 'shadow-amber-500/10', href: 'racing' },
    { name: 'Horror', icon: '💀', color: 'from-slate-500/20 to-red-900/10', border: 'border-slate-500/20', glow: 'shadow-slate-500/10', href: 'horror' },
    { name: 'Indie', icon: '💎', color: 'from-pink-500/20 to-rose-600/10', border: 'border-pink-500/20', glow: 'shadow-pink-500/10', href: 'indie' },
    { name: 'FPS', icon: '🎯', color: 'from-cyan-500/20 to-blue-600/10', border: 'border-cyan-500/20', glow: 'shadow-cyan-500/10', href: 'fps' },
    { name: 'MMO', icon: '🌍', color: 'from-blue-500/20 to-indigo-600/10', border: 'border-blue-500/20', glow: 'shadow-blue-500/10', href: 'mmo' },
];

const STATS = [
    { value: '6+', label: 'Games Available', icon: '🎮' },
    { value: '10K+', label: 'Active Players', icon: '👾' },
    { value: '100%', label: 'Free Tier', icon: '🆓' },
    { value: '24/7', label: 'Online Support', icon: '💬' },
];

function CountUp({ end, duration = 2000 }: { end: string; duration?: number }) {
    return <span>{end}</span>;
}

export default function HomePage() {
    const [featured, setFeatured] = useState<any[]>([]);
    const [trending, setTrending] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const heroRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    useEffect(() => {
        Promise.all([gamesAPI.getFeatured(), gamesAPI.getTrending()])
            .then(([f, t]) => {
                setFeatured(f.data.games || []);
                setTrending(t.data.games || []);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.08 } },
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.4, 0, 0.2, 1] } },
    };

    return (
        <div className="space-y-14 relative">
            {/* Background ambient orbs */}
            <div className="ambient-glow bg-violet-600 -top-20 -left-20" />
            <div className="ambient-glow-2 bg-indigo-600 -bottom-40 right-0" />
            <div className="ambient-glow bg-cyan-600 top-1/2 right-1/4 opacity-[0.025]" />

            {/* ── HERO ── */}
            <motion.section
                ref={heroRef}
                style={{ y: heroY, opacity: heroOpacity }}
                className="relative overflow-hidden rounded-2xl min-h-[460px] flex items-center"
            >
                {/* Background layers */}
                <div className="absolute inset-0 grid-lines opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#0d0a1a] via-[var(--bg-secondary)] to-[#0a0d1a]" />
                <div
                    className="absolute inset-0 bg-cover bg-center opacity-[0.06] mix-blend-luminosity"
                    style={{ backgroundImage: "url('https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1400')" }}
                />
                {/* Glow corners */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] animate-bounce-subtle" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-600/8 rounded-full blur-[100px]" />
                {/* Border */}
                <div className="absolute inset-0 rounded-2xl border border-[var(--border-bright)]" />
                {/* Neon top border */}
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500/60 to-transparent" />

                <div className="relative z-10 px-8 py-16 md:px-16 md:py-20 w-full">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={containerVariants}
                    >
                        {/* Badge */}
                        <motion.div variants={itemVariants}>
                            <span className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold border border-violet-500/30 bg-violet-500/10 text-violet-300 mb-6 tracking-wide">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
                                Next-Gen Gaming Platform
                            </span>
                        </motion.div>

                        {/* Headline */}
                        <motion.h1 variants={itemVariants} className="text-5xl font-black leading-none md:text-7xl lg:text-8xl mb-6">
                            <span style={{ fontFamily: 'Orbitron, sans-serif' }} className="gradient-text block glow-text">NEXUS</span>
                            <span className="text-[var(--text-primary)] text-3xl md:text-5xl font-semibold tracking-tight block mt-2">Gaming Platform</span>
                        </motion.h1>

                        {/* Description */}
                        <motion.p variants={itemVariants} className="max-w-lg text-[15px] leading-relaxed text-[var(--text-secondary)] mb-8">
                            Discover, download & master incredible games. Join thousands of players worldwide — track achievements, connect with friends, and build your ultimate collection.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-3 mb-14">
                            <Link href="/store" className="btn-primary py-3.5 px-8 text-[15px] flex items-center gap-2">
                                <span>Explore Store</span>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                            <Link href="/library" className="btn-secondary py-3.5 px-8 text-[15px]">My Library</Link>
                        </motion.div>

                        {/* Stats */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-8">
                            {STATS.map((s, i) => (
                                <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}>
                                    <div className="text-2xl font-extrabold text-[var(--text-primary)] flex items-baseline gap-1.5">
                                        <span>{s.icon}</span>
                                        <span className="gradient-text">{s.value}</span>
                                    </div>
                                    <div className="text-xs text-[var(--text-muted)] mt-0.5">{s.label}</div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* ── FEATURED ── */}
            <section>
                <div className="mb-6 flex items-end justify-between">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="text-2xl font-bold flex items-center gap-3"
                        >
                            <span className="text-violet-400">⭐</span>
                            Featured Games
                        </motion.h2>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Handpicked experiences for you</p>
                    </div>
                    <Link href="/store" className="btn-ghost text-xs py-1.5 px-4 flex items-center gap-1">
                        View All <span className="text-violet-400">→</span>
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5">
                        {[...Array(5)].map((_, i) => <div key={i} className="shimmer aspect-[3/4] rounded-2xl" />)}
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-5"
                    >
                        {featured.map(game => (
                            <motion.div key={game._id} variants={itemVariants}>
                                <GameCard game={game} />
                            </motion.div>
                        ))}
                        {featured.length === 0 && (
                            <div className="col-span-full text-center py-12 text-[var(--text-muted)]">
                                <div className="text-4xl mb-2">🎮</div>
                                <p className="text-sm">No featured games yet — <Link href="/admin" className="text-violet-400 hover:underline">add some in admin</Link></p>
                            </div>
                        )}
                    </motion.div>
                )}
            </section>

            {/* ── GENRES ── */}
            <section>
                <motion.h2
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-2xl font-bold mb-6 flex items-center gap-3"
                >
                    <span className="text-cyan-400">🎯</span>
                    Browse by Genre
                </motion.h2>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8"
                >
                    {GENRES.map((g) => (
                        <motion.div key={g.name} variants={itemVariants}>
                            <Link
                                href={`/store?genre=${g.href}`}
                                className={`group flex flex-col items-center gap-2.5 rounded-2xl border ${g.border} bg-gradient-to-br ${g.color} p-4 transition-all duration-300 hover:scale-105 hover:shadow-xl ${g.glow} hover:border-opacity-60 text-center`}
                            >
                                <span className="text-2xl transition-transform duration-300 group-hover:scale-125 group-hover:-rotate-6">{g.icon}</span>
                                <span className="text-xs font-semibold text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">{g.name}</span>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </section>

            {/* ── TRENDING ── */}
            {trending.length > 0 && (
                <section>
                    <div className="mb-6 flex items-end justify-between">
                        <div>
                            <motion.h2
                                initial={{ opacity: 0, x: -10 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-2xl font-bold flex items-center gap-3"
                            >
                                <span className="text-amber-400">🔥</span>
                                Trending Now
                            </motion.h2>
                            <p className="text-sm text-[var(--text-muted)] mt-1">Most downloaded this week</p>
                        </div>
                        <Link href="/store?sort=-totalDownloads" className="btn-ghost text-xs py-1.5 px-4 flex items-center gap-1">
                            View All <span className="text-amber-400">→</span>
                        </Link>
                    </div>
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6"
                    >
                        {trending.slice(0, 6).map(game => (
                            <motion.div key={game._id} variants={itemVariants}>
                                <GameCard game={game} />
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
            )}

            {/* ── CTA BANNER ── */}
            <motion.section
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative overflow-hidden rounded-2xl border border-[var(--border-bright)] p-10 text-center"
            >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 via-indigo-900/10 to-transparent" />
                <div className="absolute inset-0 grid-lines opacity-20" />
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/50 to-transparent" />
                <div className="relative z-10">
                    <div className="text-4xl mb-4 animate-bounce-subtle">🚀</div>
                    <h3 className="text-2xl font-bold mb-2">Ready to Play?</h3>
                    <p className="text-[var(--text-secondary)] mb-6 max-w-md mx-auto text-sm">Join thousands of gamers. Free to start, always expanding.</p>
                    <div className="flex items-center justify-center gap-3">
                        <Link href="/signup" className="btn-primary py-3 px-8">Create Free Account</Link>
                        <Link href="/store" className="btn-secondary py-3 px-8">Browse Games</Link>
                    </div>
                </div>
            </motion.section>
        </div>
    );
}
