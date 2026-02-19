'use client';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState('');
    const { user, isAuthenticated, logout } = useAuthStore();
    const { notifications } = useChatStore();
    const [showMenu, setShowMenu] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const unread = notifications.length;

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) setShowMenu(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 10);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const menuItems = [
        { href: '/profile', icon: '👤', label: 'Profile' },
        { href: '/library', icon: '📚', label: 'Library' },
        { href: '/achievements', icon: '🏆', label: 'Achievements' },
        { href: '/wishlist', icon: '💜', label: 'Wishlist' },
    ];

    return (
        <nav className={`sticky top-0 z-50 flex items-center justify-between px-5 py-3 transition-all duration-300 ${scrolled
            ? 'bg-[rgba(6,6,8,0.95)] backdrop-blur-2xl border-b border-[var(--border)]'
            : 'bg-[rgba(6,6,8,0.7)] backdrop-blur-xl border-b border-transparent'
            }`}
        >
            {/* Left: Logo + Search */}
            <div className="flex items-center gap-4">
                <Link href="/" className="flex items-center gap-2.5 group shrink-0">
                    {/* Logo mark */}
                    <div className="relative flex h-9 w-9 items-center justify-center">
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 blur-sm opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-xl shadow-violet-500/20 group-hover:shadow-violet-500/40 transition-shadow">
                            <span className="font-black text-white text-sm tracking-tight" style={{ fontFamily: 'Orbitron, sans-serif' }}>N</span>
                        </div>
                    </div>
                    <span className="hidden text-[17px] font-extrabold tracking-tight md:block" style={{ fontFamily: 'Orbitron, sans-serif' }}>
                        <span className="gradient-text">NEXUS</span>
                    </span>
                </Link>

                {/* Search */}
                <div className="hidden md:block relative">
                    <div className={`flex items-center gap-2 rounded-xl border transition-all duration-300 ${searchFocused
                        ? 'border-[var(--accent)] bg-[rgba(124,58,237,0.06)] shadow-[0_0_0_3px_rgba(124,58,237,0.12)]'
                        : 'border-[var(--border)] bg-[rgba(255,255,255,0.03)]'}`}
                    >
                        <svg className={`ml-3 h-4 w-4 shrink-0 transition-colors ${searchFocused ? 'text-[var(--accent-light)]' : 'text-[var(--text-muted)]'}`}
                            fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                            onKeyDown={e => {
                                if (e.key === 'Enter' && searchQuery.trim()) {
                                    router.push(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
                                    setSearchQuery('');
                                }
                            }}
                            placeholder="Search games, players..."
                            className="w-64 bg-transparent py-2 pr-4 text-sm outline-none placeholder:text-[var(--text-muted)] text-[var(--text-primary)]"
                        />
                        {searchQuery && (
                            <kbd className="mr-2 hidden rounded-md border border-[var(--border)] px-1.5 py-0.5 text-[10px] text-[var(--text-muted)] sm:block">↵</kbd>
                        )}
                    </div>
                </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-1.5">
                {isAuthenticated ? (
                    <>
                        {/* Notifications */}
                        <Link href="/notifications"
                            className="relative flex h-9 w-9 items-center justify-center rounded-xl transition-all hover:bg-[var(--bg-hover)] group">
                            <svg className="h-[18px] w-[18px] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            {unread > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-br from-red-500 to-rose-600 text-[9px] font-bold text-white ring-2 ring-[var(--bg-primary)]"
                                >{unread > 9 ? '9+' : unread}</motion.span>
                            )}
                        </Link>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowMenu(!showMenu)}
                                className={`flex items-center gap-2.5 rounded-xl px-2.5 py-1.5 transition-all duration-200 ${showMenu ? 'bg-[var(--bg-hover)]' : 'hover:bg-[var(--bg-hover)]'}`}
                            >
                                <div className="relative">
                                    <img
                                        src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                        alt=""
                                        className="h-7 w-7 rounded-full ring-2 ring-[var(--border)] transition group-hover:ring-[var(--accent)]"
                                    />
                                    <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-[var(--bg-primary)] bg-emerald-500" />
                                </div>
                                <span className="hidden text-sm font-medium md:block text-[var(--text-primary)]">{user?.username}</span>
                                <motion.svg
                                    animate={{ rotate: showMenu ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="hidden h-3 w-3 text-[var(--text-muted)] md:block"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                </motion.svg>
                            </button>

                            <AnimatePresence>
                                {showMenu && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                                        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
                                        className="absolute right-0 top-12 z-50 w-56 overflow-hidden rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-card)] shadow-2xl shadow-black/60"
                                    >
                                        {/* User header */}
                                        <div className="px-4 py-3.5 bg-gradient-to-b from-[var(--bg-elevated)] to-transparent border-b border-[var(--border)]">
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                                                    alt=""
                                                    className="h-9 w-9 rounded-full ring-2 ring-violet-500/30"
                                                />
                                                <div>
                                                    <p className="text-sm font-semibold text-[var(--text-primary)]">{user?.username}</p>
                                                    <p className="text-[11px] text-[var(--text-muted)] flex items-center gap-1">
                                                        <span style={{ background: 'var(--grad-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                                            Lvl {user?.steamLevel}
                                                        </span>
                                                        <span className="capitalize px-1.5 py-0.5 rounded bg-[var(--bg-primary)] text-[10px]">{user?.role}</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-1.5">
                                            {menuItems.map((item, i) => (
                                                <motion.div
                                                    key={item.href}
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: i * 0.04 }}
                                                >
                                                    <Link
                                                        href={item.href}
                                                        className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-all duration-150 ${pathname === item.href ? 'bg-[var(--accent-glow)] text-[var(--accent-light)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'}`}
                                                        onClick={() => setShowMenu(false)}
                                                    >
                                                        <span className="text-base">{item.icon}</span>
                                                        {item.label}
                                                    </Link>
                                                </motion.div>
                                            ))}

                                            {user?.role === 'admin' && (
                                                <Link href="/admin" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/10 transition-all" onClick={() => setShowMenu(false)}>
                                                    <span className="text-base">⚙️</span>Admin Panel
                                                </Link>
                                            )}
                                            {['developer', 'admin'].includes(user?.role || '') && (
                                                <Link href="/developer" className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-cyan-400 hover:bg-cyan-500/10 transition-all" onClick={() => setShowMenu(false)}>
                                                    <span className="text-base">🛠️</span>Developer
                                                </Link>
                                            )}

                                            <div className="my-1.5 h-px bg-[var(--border)]" />
                                            <button
                                                onClick={() => { logout(); setShowMenu(false); }}
                                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[var(--red)] transition-all hover:bg-red-500/10"
                                            >
                                                <span className="text-base">🚪</span>Sign Out
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-2">
                        <Link href="/login" className="btn-ghost text-sm py-2 px-4">Sign In</Link>
                        <Link href="/signup" className="btn-primary text-sm py-2">Get Started</Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
