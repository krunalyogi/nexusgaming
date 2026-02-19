'use client';
import { useEffect, useState } from 'react';
import { notificationsAPI } from '@/lib/api';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function NotificationsPage() {
    const [notifs, setNotifs] = useState<any[]>([]);

    useEffect(() => { notificationsAPI.getAll().then(r => setNotifs(r.data.notifications || [])).catch(console.error); }, []);

    const markRead = async (id: string) => {
        await notificationsAPI.markRead(id);
        setNotifs(n => n.map(x => x._id === id ? { ...x, read: true } : x));
    };

    const markAll = async () => {
        await notificationsAPI.markAllRead();
        setNotifs(n => n.map(x => ({ ...x, read: true })));
        toast.success('All marked as read');
    };

    const icon = (type: string) => ({ achievement: '🏆', friend_request: '👥', game_update: '🔄', sale: '💰', system: '📢' }[type] || '🔔');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <p className="text-sm text-[var(--text-muted)] mt-0.5">{notifs.filter(n => !n.read).length} unread</p>
                </div>
                <button onClick={markAll} className="btn-ghost text-xs py-1.5 px-4">Mark all read</button>
            </div>
            {notifs.length === 0 ? (
                <div className="glass-card flex flex-col items-center p-16 text-center">
                    <span className="text-4xl mb-3">🔔</span>
                    <h3 className="text-lg font-semibold">No notifications</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">You're all caught up!</p>
                </div>
            ) : (
                <div className="space-y-1.5">
                    {notifs.map((n, i) => (
                        <motion.div key={n._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                            onClick={() => markRead(n._id)}
                            className={`cursor-pointer rounded-xl border p-4 transition hover:bg-[var(--bg-hover)] ${n.read ? 'border-transparent bg-[var(--bg-card)]' : 'border-l-2 border-[var(--accent)] bg-[var(--bg-card)]'}`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-xl flex-shrink-0">{icon(n.type)}</span>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-sm font-semibold">{n.title}</h3>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{n.message}</p>
                                    <p className="text-[11px] text-[var(--text-muted)] mt-1">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                                {!n.read && <div className="h-2 w-2 rounded-full bg-[var(--accent)] flex-shrink-0" />}
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
