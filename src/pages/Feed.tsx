import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatRelativeTime, cn } from '../lib/utils';
import { Image as ImageIcon, Heart, MessageCircle, Send, MoreHorizontal, User, Compass } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const Feed: React.FC = () => {
    const { user } = useAuth();
    const [posts, setPosts] = useState<any[]>([]);
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    const fetchFeed = async () => {
        try {
            const res = await api.get('/posts/feed');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setFetching(false);
        }
    };

    useEffect(() => {
        fetchFeed();
    }, []);

    const handleCreatePost = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !image) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('content', content);
        if (image) formData.append('image', image);

        try {
            await api.post('/posts', formData);
            setContent('');
            setImage(null);
            fetchFeed(); // Refresh feed
        } catch (err) {
            alert('Gagal membuat postingan');
        } finally {
            setLoading(false);
        }
    };

    const handleLike = async (postId: number) => {
        try {
            const res = await api.post(`/social/${postId}/like`);
            setPosts(posts.map(p => p.id === postId ? { ...p, isLiked: res.liked } : p));
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="flex-1 max-w-6xl mx-auto py-8 px-4 pb-24 md:pb-8 flex gap-8">
            <div className="flex-1 max-w-2xl">
                <header className="mb-8 hidden md:block">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tight font-display">Feed Jelajah</h1>
                            <p className="text-[10px] text-blue-500 uppercase tracking-[0.2em] font-black mt-1">Global Network Activity</p>
                        </div>
                    </div>
                </header>

                {/* Create Post Box */}
            <div className="bento-card p-4 mb-8">
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex-shrink-0 overflow-hidden">
                        {user?.avatar ? (
                            <img src={user.avatar} alt="Me" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <User size={20} />
                            </div>
                        )}
                    </div>
                    <form onSubmit={handleCreatePost} className="flex-1">
                        <textarea 
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            placeholder="Apa yang Anda pikirkan?"
                            className="w-full bg-transparent border-none focus:ring-0 text-white placeholder:text-slate-600 resize-none min-h-[80px]"
                        />
                        
                        {image && (
                            <div className="relative mt-2 mb-4 group inline-block">
                                <img src={URL.createObjectURL(image)} alt="Preview" className="max-h-48 rounded-xl border border-white/10" />
                                <button 
                                    onClick={() => setImage(null)}
                                    className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <MoreHorizontal size={14} className="rotate-45" />
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center pt-3 border-t border-white/5">
                            <div className="flex gap-2">
                                <label className="cursor-pointer p-2 hover:bg-white/5 rounded-full transition-colors text-blue-500">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        className="hidden" 
                                        onChange={(e) => setImage(e.target.files?.[0] || null)}
                                    />
                                    <ImageIcon size={20} />
                                </label>
                            </div>
                            <button 
                                type="submit"
                                disabled={loading || (!content.trim() && !image)}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                {loading ? 'Mengirim...' : 'Posting'}
                                <Send size={14} />
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Timeline */}
            {fetching ? (
                <div className="space-y-4">
                    {[1,2,3].map(i => (
                        <div key={i} className="bento-card p-6 h-64 animate-pulse bg-white/5"></div>
                    ))}
                </div>
            ) : posts.length === 0 ? (
                <div className="text-center py-20 opacity-40">
                    <Compass size={48} className="mx-auto mb-4" />
                    <p>Belum ada postingan. Mulai ikuti orang lain!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    <AnimatePresence mode="popLayout">
                        {posts.map((post) => (
                            <motion.article 
                                key={post.id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bento-card overflow-hidden"
                            >
                                <div className="p-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-slate-800 rounded-full overflow-hidden">
                                            {post.avatar ? (
                                                <img src={post.avatar} alt={post.username} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-slate-500">
                                                    <User size={20} />
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-white text-sm leading-tight">{post.username}</h4>
                                            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">
                                                {formatRelativeTime(post.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    <button className="text-slate-600 hover:text-white transition-colors">
                                        <MoreHorizontal size={20} />
                                    </button>
                                </div>

                                <div className="px-4 pb-4">
                                    <p className="text-white/90 text-sm whitespace-pre-wrap leading-relaxed">{post.content}</p>
                                </div>

                                {post.image_url && (
                                    <div className="bg-black/20 border-y border-white/5 mx-[-1px]">
                                        <img src={post.image_url} alt="Post content" className="w-full h-auto max-h-[600px] object-contain" />
                                    </div>
                                )}

                                <div className="p-4 flex items-center gap-6 border-t border-white/5">
                                    <button 
                                        onClick={() => handleLike(post.id)}
                                        className={cn(
                                            "flex items-center gap-2 text-sm transition-colors",
                                            post.isLiked ? "text-rose-500" : "text-slate-500 hover:text-rose-500"
                                        )}
                                    >
                                        <Heart size={20} fill={post.isLiked ? "currentColor" : "none"} />
                                        <span className="font-mono text-xs">Like</span>
                                    </button>
                                    <button className="flex items-center gap-2 text-slate-500 hover:text-blue-500 text-sm transition-colors">
                                        <MessageCircle size={20} />
                                        <span className="font-mono text-xs">Komen</span>
                                    </button>
                                </div>
                            </motion.article>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            </div>

            {/* Right Sidebar - Discovery */}
            <aside className="hidden lg:block w-80 space-y-6">
                <div className="bento-card p-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Compass size={16} className="text-blue-500" /> Jelajahi User
                    </h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-slate-800 rounded-xl"></div>
                                    <div>
                                        <div className="h-3 w-20 bg-slate-800 rounded mb-1"></div>
                                        <div className="h-2 w-12 bg-slate-800/50 rounded"></div>
                                    </div>
                                </div>
                                <button className="text-[10px] font-black text-blue-500 hover:text-white uppercase tracking-tight transition-colors">Ikuti</button>
                            </div>
                        ))}
                    </div>
                    <button className="w-full mt-6 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all">Lihat Semua</button>
                </div>

                <div className="bento-card p-6 bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border-blue-500/20">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest mb-2 italic">Trending #Hashtag</h3>
                    <div className="flex flex-wrap gap-2 mt-4">
                        {['#SocialHub', '#Tech', '#Desain', '#AI'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-blue-400 cursor-pointer hover:bg-blue-500 hover:text-white transition-all">
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="px-6 opacity-30">
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-loose">
                        Tentang &bull; Bantuan &bull; Privasi &bull; Ketentuan &bull; Bahasa
                        <br />
                        SocialHub &copy; 2026 AI-Build
                    </p>
                </div>
            </aside>
        </div>
    );
};

export default Feed;
