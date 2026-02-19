'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { aiAPI } from '@/lib/api';

export default function AIPage() {
    const [messages, setMessages] = useState<{ role: string; content: string }[]>([{ role: 'assistant', content: 'Hey gamer! 🎮 I\'m your AI gaming assistant. Ask me about game recommendations, tips, news, or anything gaming-related!' }]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [recs, setRecs] = useState<any[]>([]);
    const chatEnd = useRef<HTMLDivElement>(null);

    useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = async () => {
        if (!input.trim() || loading) return;
        const msg = input; setInput('');
        setMessages(p => [...p, { role: 'user', content: msg }]);
        setLoading(true);
        try {
            const { data } = await aiAPI.chatbot(msg);
            setMessages(p => [...p, { role: 'assistant', content: data.response }]);
        } catch {
            setMessages(p => [...p, { role: 'assistant', content: 'Sorry, I had an issue. Try again!' }]);
        }
        setLoading(false);
    };

    const getRecs = async () => {
        setLoading(true);
        try { const { data } = await aiAPI.recommend(); setRecs(data.recommendations || []); } catch { setRecs([]); }
        setLoading(false);
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">AI Assistant</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">Your personal gaming companion</p>
            </div>

            <div className="flex gap-4 flex-col lg:flex-row">
                {/* Chat */}
                <div className="flex flex-1 flex-col rounded-xl border border-[var(--border)] overflow-hidden" style={{ height: 'calc(100vh - 200px)' }}>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2.5 bg-[var(--bg-primary)]">
                        {messages.map((m, i) => (
                            <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border)]'}`}>
                                    {m.role === 'assistant' && <span className="mb-1 block text-[10px] font-medium text-[var(--accent-light)]">🤖 AI Assistant</span>}
                                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                                </div>
                            </motion.div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="h-2 w-2 rounded-full bg-[var(--text-muted)] animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={chatEnd} />
                    </div>
                    <div className="border-t border-[var(--border)] p-3 bg-[var(--bg-secondary)]">
                        <div className="flex gap-2">
                            <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Ask me anything about games..." className="input-dark flex-1" />
                            <button onClick={send} disabled={loading} className="btn-primary px-5 disabled:opacity-50">Send</button>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="w-full lg:w-72 space-y-4">
                    <div className="glass-card p-4">
                        <h3 className="font-semibold text-sm mb-2">🎯 AI Recommendations</h3>
                        <p className="text-xs text-[var(--text-muted)] mb-3">Get personalized game suggestions based on your library.</p>
                        <button onClick={getRecs} disabled={loading} className="btn-primary w-full text-sm py-2 disabled:opacity-50">Get Recommendations</button>
                        {recs.length > 0 && (
                            <div className="mt-3 space-y-2">
                                {recs.map((r: any) => (
                                    <div key={r._id} className="rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] p-3">
                                        <p className="text-sm font-medium">{r.title}</p>
                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">{r.shortDescription}</p>
                                        <span className="text-xs text-amber-400">⭐ {r.averageRating}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="glass-card p-4">
                        <h3 className="text-sm font-semibold mb-2">Quick Questions</h3>
                        <div className="space-y-1">
                            {['Best free RPG games?', 'Tips for beginners?', 'Trending games this week?', 'Best multiplayer games?'].map(q => (
                                <button key={q} onClick={() => setInput(q)} className="block w-full rounded-lg bg-[var(--bg-primary)] border border-[var(--border)] px-3 py-2 text-left text-xs text-[var(--text-secondary)] transition hover:border-[var(--border-glow)] hover:text-white">{q}</button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
