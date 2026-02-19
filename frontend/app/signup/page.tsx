'use client';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const PERKS = [
    { icon: '🎮', text: 'Access 500+ games' },
    { icon: '🏆', text: 'Track achievements' },
    { icon: '👥', text: 'Connect with players' },
    { icon: '🆓', text: 'Free tier always' },
];

export default function SignupPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);
    const { register } = useAuthStore();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
        setLoading(true);
        try {
            await register(username, email, password);
            toast.success('Account created! Welcome to Nexus 🎮');
            router.push('/');
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
        setLoading(false);
    };

    const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
    const strengthColors = ['', 'bg-red-500', 'bg-amber-400', 'bg-emerald-500'];
    const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

    return (
        <div className="flex min-h-[88vh] items-center justify-center relative overflow-hidden px-4 py-8">
            <div className="absolute inset-0 grid-lines opacity-25" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-violet-600/8 rounded-full blur-[140px]" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[300px] bg-indigo-600/8 rounded-full blur-[100px]" />

            {/* Floating particles */}
            {[...Array(4)].map((_, i) => (
                <div key={i}
                    className="absolute w-1.5 h-1.5 rounded-full bg-violet-400/30 animate-bounce-subtle"
                    style={{
                        top: `${[15, 60, 30, 80][i]}%`,
                        left: `${[10, 85, 70, 20][i]}%`,
                        animationDelay: `${i * 0.7}s`,
                    }}
                />
            ))}

            <motion.div
                initial={{ opacity: 0, y: 24, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                className="w-full max-w-[440px] relative"
            >
                <div className="relative overflow-hidden rounded-2xl border border-[var(--border-bright)] bg-[var(--bg-card)] shadow-2xl shadow-black/60">
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-400/70 to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-28 bg-violet-600/8 rounded-full blur-2xl" />

                    <div className="relative z-10 p-8">
                        {/* Header */}
                        <div className="mb-7 text-center">
                            <motion.div
                                whileHover={{ scale: 1.05, rotate: -5 }}
                                transition={{ type: 'spring', stiffness: 400 }}
                                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl relative"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                            >
                                <span className="font-black text-white text-xl" style={{ fontFamily: 'Orbitron, sans-serif' }}>N</span>
                                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent" />
                            </motion.div>
                            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Join Nexus</h1>
                            <p className="mt-1 text-sm text-[var(--text-muted)]">Create your free account today</p>
                        </div>

                        {/* Perks strip */}
                        <div className="mb-6 grid grid-cols-4 gap-1">
                            {PERKS.map((p, i) => (
                                <motion.div key={p.text}
                                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.07 }}
                                    className="flex flex-col items-center gap-1 rounded-xl border border-[var(--border)] bg-[rgba(255,255,255,0.02)] p-2 text-center"
                                >
                                    <span className="text-base">{p.icon}</span>
                                    <span className="text-[9px] text-[var(--text-muted)] leading-tight">{p.text}</span>
                                </motion.div>
                            ))}
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {[
                                {
                                    id: 'username', label: 'Username', type: 'text', value: username, onChange: setUsername,
                                    placeholder: 'YourGamertag',
                                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                },
                                {
                                    id: 'email', label: 'Email', type: 'email', value: email, onChange: setEmail,
                                    placeholder: 'you@email.com',
                                    icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                },
                            ].map(field => (
                                <div key={field.id}>
                                    <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">{field.label}</label>
                                    <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === field.id ? 'border-[var(--accent)] shadow-[0_0_0_3px_rgba(124,58,237,0.12)]' : 'border-[var(--border)]'}`}>
                                        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">{field.icon}</div>
                                        <input type={field.type} value={field.value} onChange={e => field.onChange(e.target.value)} required
                                            placeholder={field.placeholder}
                                            onFocus={() => setFocusedField(field.id)} onBlur={() => setFocusedField(null)}
                                            className="w-full bg-transparent rounded-xl py-3 pl-10 pr-4 text-sm outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                                        />
                                    </div>
                                </div>
                            ))}

                            {/* Password */}
                            <div>
                                <label className="block text-[11px] font-semibold text-[var(--text-muted)] uppercase tracking-widest mb-1.5">Password</label>
                                <div className={`relative rounded-xl border transition-all duration-300 ${focusedField === 'password' ? 'border-[var(--accent)] shadow-[0_0_0_3px_rgba(124,58,237,0.12)]' : 'border-[var(--border)]'}`}>
                                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                    </div>
                                    <input type={showPass ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                                        placeholder="Min 6 characters"
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
                                {/* Strength indicator */}
                                {password && (
                                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 space-y-1">
                                        <div className="flex gap-1.5">
                                            {[1, 2, 3].map(s => (
                                                <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-500 ${s <= strength ? strengthColors[strength] : 'bg-[var(--bg-elevated)]'}`} />
                                            ))}
                                        </div>
                                        <p className={`text-[11px] ${strength === 1 ? 'text-red-400' : strength === 2 ? 'text-amber-400' : 'text-emerald-400'}`}>
                                            {strengthLabels[strength]} password
                                        </p>
                                    </motion.div>
                                )}
                            </div>

                            <motion.button
                                whileHover={{ scale: loading ? 1 : 1.01 }}
                                whileTap={{ scale: loading ? 1 : 0.98 }}
                                type="submit" disabled={loading}
                                className="btn-primary w-full py-3.5 mt-1 disabled:opacity-60 flex items-center justify-center gap-2"
                                style={{ background: 'linear-gradient(135deg, #7c3aed, #ec4899)' }}
                            >
                                {loading ? (
                                    <>
                                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Creating account...
                                    </>
                                ) : '🚀 Create Free Account'}
                            </motion.button>
                        </form>

                        <p className="mt-5 text-center text-sm text-[var(--text-muted)]">
                            Already have an account?{' '}
                            <Link href="/login" className="font-semibold text-[var(--accent-light)] hover:text-violet-300 transition-colors">Sign in</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
