'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const navItems = [
    {
        section: 'Discover',
        items: [
            {
                href: '/', label: 'Home',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            },
            {
                href: '/store', label: 'Store',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
            },
            {
                href: '/library', label: 'Library',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
            },
            {
                href: '/wishlist', label: 'Wishlist',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
            },
        ]
    },
    {
        section: 'Social',
        items: [
            {
                href: '/friends', label: 'Friends',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            },
            {
                href: '/chat', label: 'Chat',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
            },
            {
                href: '/achievements', label: 'Achievements',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
            },
        ]
    },
    {
        section: 'Tools',
        items: [
            {
                href: '/mods', label: 'Mods',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
            },
            {
                href: '/ai', label: 'AI Assistant',
                icon: <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                badge: 'AI'
            },
        ]
    },
];

export default function Sidebar() {
    const pathname = usePathname();
    const [collapsed, setCollapsed] = useState(false);

    const isActive = (href: string) =>
        href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(href + '/');

    return (
        <motion.aside
            animate={{ width: collapsed ? 60 : 220 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="hidden md:flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border)] overflow-hidden shrink-0 relative"
        >
            {/* Subtle grid lines */}
            <div className="absolute inset-0 grid-lines opacity-30 pointer-events-none" />

            {/* Collapse toggle */}
            <div className="flex h-11 items-center justify-end px-2 pt-1">
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-[var(--text-muted)] transition-all hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]"
                >
                    <motion.svg animate={{ rotate: collapsed ? 0 : 180 }} transition={{ duration: 0.3 }}
                        className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </motion.svg>
                </button>
            </div>

            {/* Nav sections */}
            <nav className="flex-1 overflow-y-auto overflow-x-hidden py-2 px-2 no-scrollbar">
                {navItems.map((section, si) => (
                    <div key={section.section} className={si > 0 ? 'mt-3' : ''}>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)] mb-0.5"
                                >
                                    {section.section}
                                </motion.p>
                            )}
                        </AnimatePresence>
                        <div className="space-y-0.5">
                            {section.items.map(item => {
                                const active = isActive(item.href);
                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        title={collapsed ? item.label : undefined}
                                        className={`relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-medium transition-all duration-200 group overflow-hidden ${active ? 'nav-active' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-primary)]'} ${collapsed ? 'justify-center' : ''}`}
                                    >
                                        {/* Active glow */}
                                        {active && (
                                            <motion.div
                                                layoutId="sidebar-active"
                                                className="absolute inset-0 rounded-xl bg-gradient-to-r from-violet-500/10 to-transparent"
                                                transition={{ duration: 0.25 }}
                                            />
                                        )}
                                        <span className={`relative z-10 shrink-0 ${active ? 'text-[var(--accent-light)]' : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'} transition-colors`}>
                                            {item.icon}
                                        </span>
                                        <AnimatePresence>
                                            {!collapsed && (
                                                <motion.span
                                                    initial={{ opacity: 0, x: -8 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -8 }}
                                                    transition={{ duration: 0.2 }}
                                                    className="relative z-10 flex-1 flex items-center justify-between"
                                                >
                                                    {item.label}
                                                    {'badge' in item && item.badge && (
                                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500/30 to-indigo-500/30 text-violet-300 border border-violet-500/20">
                                                            {item.badge}
                                                        </span>
                                                    )}
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </nav>

            {/* Footer */}
            <AnimatePresence>
                {!collapsed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-t border-[var(--border)] p-4"
                    >
                        <div className="rounded-xl bg-gradient-to-br from-violet-500/8 to-indigo-500/5 border border-violet-500/10 p-3 text-center">
                            <p className="text-[10px] font-semibold tracking-widest uppercase text-[var(--text-muted)]">Nexus Gaming</p>
                            <p className="text-[9px] text-[var(--text-muted)] mt-0.5 mono opacity-60">v1.0.0</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.aside>
    );
}
