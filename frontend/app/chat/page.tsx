'use client';
import { useEffect, useState, useRef } from 'react';
import { chatAPI, friendsAPI } from '@/lib/api';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { motion } from 'framer-motion';

export default function ChatPage() {
    const { user } = useAuthStore();
    const { socket, onlineUsers } = useChatStore();
    const [friends, setFriends] = useState<any[]>([]);
    const [selected, setSelected] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [input, setInput] = useState('');
    const chatEnd = useRef<HTMLDivElement>(null);

    useEffect(() => { friendsAPI.getAll().then(r => setFriends(r.data.friends || [])).catch(console.error); }, []);

    useEffect(() => {
        if (!selected || !user) return;
        chatAPI.getHistory(selected._id).then(r => setMessages(r.data.messages || [])).catch(console.error);
    }, [selected, user]);

    useEffect(() => {
        if (!socket) return;
        const handler = (msg: any) => { if (msg.sender === selected?._id || msg.sender === user?._id) setMessages(p => [...p, msg]); };
        socket.on('receive_message', handler);
        return () => { socket.off('receive_message', handler); };
    }, [socket, selected, user]);

    useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

    const send = () => {
        if (!input.trim() || !selected || !socket || !user) return;
        socket.emit('send_message', { receiverId: selected._id, content: input });
        setMessages(p => [...p, { sender: user._id, content: input, createdAt: new Date() }]);
        setInput('');
    };

    return (
        <div className="flex gap-0 rounded-xl border border-[var(--border)] overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
            {/* Friends List */}
            <div className="w-72 border-r border-[var(--border)] bg-[var(--bg-secondary)] flex flex-col">
                <div className="p-3 border-b border-[var(--border)]">
                    <h2 className="text-sm font-semibold">Messages</h2>
                </div>
                <div className="flex-1 overflow-y-auto">
                    {friends.length === 0 ? (
                        <p className="p-4 text-xs text-[var(--text-muted)] text-center">Add friends to start chatting</p>
                    ) : friends.map(f => (
                        <button key={f._id} onClick={() => setSelected(f)}
                            className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left transition hover:bg-[var(--bg-hover)] ${selected?._id === f._id ? 'bg-[var(--bg-hover)] border-l-2 border-[var(--accent)]' : ''}`}
                        >
                            <div className="relative flex-shrink-0">
                                <img src={f.avatar} alt="" className="h-8 w-8 rounded-full" />
                                {onlineUsers.includes(f._id) && <div className="absolute -bottom-0.5 -right-0.5 online-dot ring-2 ring-[var(--bg-secondary)]" />}
                            </div>
                            <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium truncate">{f.username}</p>
                                <p className="text-[11px] text-[var(--text-muted)] truncate">{onlineUsers.includes(f._id) ? 'Online' : 'Offline'}</p>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-1 flex-col bg-[var(--bg-primary)]">
                {!selected ? (
                    <div className="flex flex-1 flex-col items-center justify-center text-center px-6">
                        <span className="text-4xl mb-3">💬</span>
                        <h3 className="text-lg font-semibold">Select a conversation</h3>
                        <p className="text-sm text-[var(--text-muted)] mt-1">Choose a friend to start chatting</p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className="flex items-center gap-3 border-b border-[var(--border)] px-4 py-3 bg-[var(--bg-secondary)]">
                            <img src={selected.avatar} alt="" className="h-8 w-8 rounded-full" />
                            <div>
                                <p className="text-sm font-semibold">{selected.username}</p>
                                <p className="text-[11px] text-[var(--text-muted)]">{onlineUsers.includes(selected._id) ? '🟢 Online' : 'Offline'}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-2">
                            {messages.map((m, i) => {
                                const isMe = m.sender === user?._id || m.sender?._id === user?._id;
                                return (
                                    <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                                        className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[70%] rounded-2xl px-3.5 py-2.5 ${isMe ? 'bg-[var(--accent)] text-white' : 'bg-[var(--bg-card)] border border-[var(--border)]'}`}>
                                            <p className="text-sm leading-relaxed">{m.content}</p>
                                            <p className={`mt-1 text-[10px] ${isMe ? 'text-white/50' : 'text-[var(--text-muted)]'}`}>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                            <div ref={chatEnd} />
                        </div>

                        {/* Input */}
                        <div className="border-t border-[var(--border)] p-3 bg-[var(--bg-secondary)]">
                            <div className="flex gap-2">
                                <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} placeholder="Type a message..." className="input-dark flex-1" />
                                <button onClick={send} className="btn-primary px-5">Send</button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
