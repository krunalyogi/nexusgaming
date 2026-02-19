'use client';
import Link from 'next/link';
import { useState } from 'react';

interface GameCardProps {
    game: {
        _id: string;
        title: string;
        slug: string;
        coverImage: string;
        price: number;
        discountPercent?: number;
        averageRating: number;
        genres: string[];
        totalDownloads?: number;
        isEarlyAccess?: boolean;
        isFeatured?: boolean;
        publisher?: string;
    };
    size?: 'sm' | 'md' | 'lg';
}

export default function GameCard({ game, size = 'md' }: GameCardProps) {
    const [imgError, setImgError] = useState(false);
    const finalPrice = game.price * (1 - (game.discountPercent || 0) / 100);

    const Stars = ({ rating }: { rating: number }) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <svg key={s} className={`w-2.5 h-2.5 ${s <= Math.round(rating) ? 'text-amber-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );

    return (
        <Link href={`/games/${game.slug}`} className="block group">
            <div className="game-card relative overflow-hidden">
                {/* Image */}
                <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-elevated)]">
                    {!imgError ? (
                        <img
                            src={game.coverImage}
                            alt={game.title}
                            className="h-full w-full object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
                            loading="lazy"
                            onError={() => setImgError(true)}
                        />
                    ) : (
                        <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[var(--bg-elevated)] to-[var(--bg-card)]">
                            <span className="text-4xl opacity-30">🎮</span>
                        </div>
                    )}

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-100" />

                    {/* Top badges */}
                    <div className="absolute left-2 top-2 flex flex-col gap-1 z-10">
                        {game.discountPercent ? (
                            <span className="badge bg-emerald-500 text-white text-[9px] shadow-lg shadow-emerald-500/30">-{game.discountPercent}%</span>
                        ) : null}
                        {game.isEarlyAccess && (
                            <span className="badge bg-amber-500 text-white text-[9px] shadow-lg shadow-amber-500/30">EARLY ACCESS</span>
                        )}
                        {game.isFeatured && (
                            <span className="badge bg-violet-500/90 text-white text-[9px] backdrop-blur-sm">⭐ FEATURED</span>
                        )}
                    </div>

                    {/* Quick view overlay */}
                    <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-semibold px-4 py-2 rounded-full">
                            View Game →
                        </div>
                    </div>

                    {/* Rating + downloads – bottom hover info */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
                        <div className="flex items-center justify-between">
                            <Stars rating={game.averageRating} />
                            {game.totalDownloads ? (
                                <span className="text-[10px] text-white/60">
                                    {game.totalDownloads > 1000 ? `${(game.totalDownloads / 1000).toFixed(0)}K` : game.totalDownloads} DL
                                </span>
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Info */}
                <div className="p-3 pb-4">
                    <h3 className="truncate text-[13px] font-semibold text-[var(--text-primary)] group-hover:text-[var(--accent-light)] transition-colors duration-300 leading-snug">
                        {game.title}
                    </h3>
                    <div className="mt-1 flex flex-wrap gap-1">
                        {game.genres.slice(0, 2).map((g: string) => (
                            <span key={g} className="tag text-[10px] capitalize">{g}</span>
                        ))}
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                        {game.price === 0 ? (
                            <span className="text-xs font-bold text-emerald-400 tracking-wide">FREE</span>
                        ) : (
                            <>
                                {game.discountPercent ? <span className="text-[11px] text-[var(--text-muted)] line-through">₹{game.price}</span> : null}
                                <span className="text-sm font-bold" style={{ background: 'var(--grad-accent)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                                    ₹{Math.round(finalPrice)}
                                </span>
                            </>
                        )}
                    </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
        </Link>
    );
}
