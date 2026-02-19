'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { login } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back! 🎮');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Login failed');
        }
        setLoading(false);
    };

    const quickFill = (e: string, p: string) => { setEmail(e); setPassword(p); };

    return (
        <div className="flex min-h-[88vh] items-center justify-center relative overflow-hidden px-4">
            {/* Animated background */}
            <div className="absolute inset-0 grid-lines opacity-30" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-violet-600/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]" />

            {/* Floating orbs */}
            <div className="absolute top-20 left-20 w-2 h-2 rounded-full bg-violet-400/40 animate-bounce-subtle" />
            <div className="absolute top-40 right-32 w-1.5 h-1.5 rounded-full bg-indigo-400/40 animate-bounce-subtle" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-32 left-40 w-2 h-2 rounded-full bg-cyan-400/30 animate-bounce-subtle" style={{ animationDelay: '2s' }} />

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[420px] relative"
            >
                {/* Card */}
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-card)] shadow-2xl shadow-black/60">
                    {/* Top glow line */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/70 to-transparent" />
                    {/* Inner glow */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-24 bg-violet-600/8 rounded-full blur-2xl" />

                    <div className="relative z-10 p-8">
                        {/* Logo */}
                        <div className="mb-8 text-center">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: 5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl shadow-2xl shadow-violet-500/30 relative"
                                style={{ background: 'var(--grad-accent)' }}
                            >
                                <span className="font-black text-white text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>N</span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/15 to-transparent" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Welcome back</h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">Sign in to your Nexus account</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email field */}
                            <div>
                                <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Email</label>
                                <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'email' ? 'border-[var(--accent)] shadow-[0_0_0_3px_rgba(124,58,237,0.12)]' : 'border-[var(--border)]'}`}>
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <input
                                        type="email" value={email} onChange={e => setEmail(e.target.value)} required
                                        placeholder="you@email.com"
                                        onFocus={() => setFocusedField('email')} onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent rounded-xl py-3 pl-10 pr-4 text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                    />
                                </div>
                            </div>

                            {/* Password field */}
                            <div>
                                <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Password</label>
                                <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password' ? 'border-[var(--accent)] shadow-[0_0_0_3px_rgba(124,58,237,0.12)]' : 'border-[var(--border)]'}`}>
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                                        placeholder="••••••••"
                                        onFocus={() => setFocusedField('password')} onBlur={() => setFocusedField(null)}
                                        className="w-full bg-transparent rounded-xl py-3 pl-10 pr-12 text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                    />
                                    <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
                                        {showPass ? (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                        ) : (
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit */}
                            <motion.button
                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                type="submit" disabled={loading}
                                className="btn-primary w-full py-3.5 mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Signing in...
                                    </>
                                ) : 'Sign In  →'}
                            </motion.button>
                        </form>

                        <p className="mt-6 text-center text-sm text-[var(--text-muted)]">
                            Don't have an account?{' '}
                            <Link href="/signup" className="font-semibold text-[var(--accent-light)] hover:text-violet-300 transition-colors">Create one free</Link>
                        </p>

                        {/* Demo credentials */}
                        <div className="mt-5 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-4">
                            <p className="text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-2.5">Quick Fill</p>
                            <div className="grid grid-cols-3 gap-2">
                                {[
                                    { label: '👤 User', e: 'gamer@nexus.com', p: 'password123' },
                                    { label: '⚙️ Admin', e: 'admin@nexus.com', p: 'admin123' },
                                    { label: '🛠️ Dev', e: 'pixel@nexus.com', p: 'password123' },
                                ].map(c => (
                                    <button key={c.label} onClick={() => quickFill(c.e, c.p)}
                                        className="text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--accent-light)] rounded-lg border border-[var(--border)] hover:border-[var(--accent)] px-2 py-1.5 transition-all text-center"
                                    >{c.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
