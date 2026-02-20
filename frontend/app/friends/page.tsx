'use client';
import { useEffect, useState } from 'react';
import { friendsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Link from 'next/link';

export default function FriendsPage() {
    const [friends, setFriends] = useState<any[]>([]);
    const [requests, setRequests] = useState<any[]>([]);
    const [searchQ, setSearchQ] = useState('');
    const [results, setResults] = useState<any[]>([]);
    const [tab, setTab] = useState('friends');

    useEffect(() => {
        friendsAPI.getAll().then(r => setFriends(r.data.friends || [])).catch(console.error);
        friendsAPI.getRequests().then(r => setRequests(r.data.requests || [])).catch(console.error);
    }, []);

    const search = () => searchQ.length >= 2 && friendsAPI.search(searchQ).then(r => setResults(r.data.users || [])).catch(console.error);
    const sendReq = (id: string) => friendsAPI.sendRequest(id).then(() => toast.success('Request sent!')).catch(() => toast.error('Already sent'));

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Friends</h1>
                <p className="text-sm text-[var(--text-muted)] mt-0.5">{friends.length} friends online</p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 rounded-lg bg-[var(--bg-secondary)] p-1 w-fit">
                {[
                    { id: 'friends', label: 'Friends', count: friends.length },
                    { id: 'requests', label: 'Requests', count: requests.length },
                    { id: 'search', label: 'Find Players' },
                ].map(t => (
                    <button key={t.id} onClick={() => setTab(t.id)}
                        className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition-all ${tab === t.id ? 'bg-[var(--bg-elevated)] text-white shadow-sm' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
                    >
                        {t.label}
                        {t.count !== undefined && t.count > 0 && <span className="rounded-full bg-[var(--accent)]/20 px-1.5 py-0.5 text-[10px] text-[var(--accent-light)]">{t.count}</span>}
                    </button>
                ))}
            </div>

            {tab === 'friends' && (
                friends.length === 0 ? (
                    <div className="glass-card flex flex-col items-center p-12 text-center">
                        <span className="text-4xl mb-3">👥</span>
                        <h3 className="text-lg font-semibold">No friends yet</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Search for players to connect with</p>
                    </div>
                ) : (
                    <div className="grid gap-2 md:grid-cols-2">
                        {friends.map((f, i) => (
                            <motion.div key={f._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3 transition hover:border-[var(--border-glow)]"
                            >
                                <div className="relative">
                                    <img src={f.avatar} alt="" className="h-10 w-10 rounded-full ring-1 ring-[var(--border)]" />
                                    {f.status === 'online' && <div className="absolute bottom-0 right-0 online-dot ring-2 ring-[var(--bg-card)]" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold truncate">{f.username}</h3>
                                    <p className="text-xs text-[var(--text-muted)]">
                                        {f.currentGame ? `Playing ${f.currentGame}` : f.status === 'online' ? 'Online' : 'Offline'}
                                    </p>
                                </div>
                                <Link href="/chat" className="btn-ghost text-xs py-1.5 px-3">Chat</Link>
                            </motion.div>
                        ))}
                    </div>
                )
            )}

            {tab === 'requests' && (
                requests.length === 0 ? (
                    <div className="glass-card p-12 text-center text-[var(--text-muted)]">No pending requests</div>
                ) : (
                    <div className="space-y-2">
                        {requests.map(r => (
                            <div key={r._id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3">
                                <img src={r.sender?.avatar} alt="" className="h-10 w-10 rounded-full" />
                                <div className="flex-1"><h3 className="text-sm font-semibold">{r.sender?.username}</h3><p className="text-xs text-[var(--text-muted)]">Wants to be friends</p></div>
                                <div className="flex gap-2">
                                    <button onClick={() => { friendsAPI.accept(r._id).then(() => { setRequests(rs => rs.filter(x => x._id !== r._id)); toast.success('Accepted!'); }); }} className="btn-primary text-xs py-1.5 px-3">Accept</button>
                                    <button onClick={() => { friendsAPI.decline(r._id).then(() => { setRequests(rs => rs.filter(x => x._id !== r._id)); }); }} className="btn-ghost text-xs py-1.5 px-3">Decline</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )
            )}

            {tab === 'search' && (
                <div className="space-y-4">
                    <div className="flex gap-2">
                        <input value={searchQ} onChange={e => setSearchQ(e.target.value)} onKeyDown={e => e.key === 'Enter' && search()} placeholder="Search by username..." className="input-dark flex-1" />
                        <button onClick={search} className="btn-primary">Search</button>
                    </div>
                    <div className="space-y-2">
                        {results.map(u => (
                            <div key={u._id} className="flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-card)] p-3">
                                <img src={u.avatar} alt="" className="h-10 w-10 rounded-full" />
                                <div className="flex-1"><h3 className="text-sm font-semibold">{u.username}</h3><p className="text-xs text-[var(--text-muted)]">Level {u.steamLevel}</p></div>
                                <button onClick={() => sendReq(u._id)} className="btn-primary text-xs py-1.5 px-3">Add Friend</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
