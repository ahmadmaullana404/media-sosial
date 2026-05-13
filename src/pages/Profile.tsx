import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { User, Grid, Heart, MessageCircle, Settings, Calendar } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

const Profile: React.FC = () => {
    const { id } = useParams();
    const { user: me } = useAuth();
    const [user, setUser] = useState<any>(null);
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/users/${id}`);
                setUser(res.data);
                // In a real app, we'd fetch user posts specifically
                const postRes = await api.get('/posts/feed'); 
                setPosts(postRes.data.filter((p: any) => p.user_id === parseInt(id!)));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [id]);

    if (loading) return <div className="p-8 text-center animate-pulse">Memuat profil...</div>;
    if (!user) return <div className="p-8 text-center text-rose-500">User tidak ditemukan</div>;

    const isMe = me?.id === user.id;

    const handleFollow = async () => {
        try {
            await api.post(`/social/users/${user.id}/follow`);
            // Refresh profile data to update follower count
            const res = await api.get(`/users/${id}`);
            setUser(res.data);
        } catch (err) {
            alert('Gagal mengikuti user');
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            {/* Header Profil */}
            <div className="bento-card p-8 mb-8">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-800 rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 relative group">
                        {user.avatar ? (
                            <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-500">
                                <User size={64} />
                            </div>
                        )}
                        {isMe && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                            <span className="text-[10px] font-bold text-white uppercase tracking-widest">Ubah Foto</span>
                          </div>
                        )}
                    </div>

                    <div className="flex-1 text-center md:text-left">
                        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
                            <h2 className="text-3xl font-bold text-white tracking-tighter uppercase font-display">{user.full_name || user.username}</h2>
                            <div className="flex gap-2 justify-center md:justify-start">
                                {isMe ? (
                                    <button className="bg-white/5 hover:bg-white/10 px-6 py-2 rounded-xl text-sm font-bold border border-white/10 transition-all flex items-center gap-2 uppercase tracking-tight">
                                        <Settings size={14} /> Pengaturan
                                    </button>
                                ) : (
                                    <button 
                                        onClick={handleFollow}
                                        className="bg-blue-600 hover:bg-blue-500 px-8 py-2 rounded-xl text-sm font-bold text-white transition-all shadow-lg shadow-blue-600/20 uppercase tracking-tight"
                                    >
                                        Ikuti
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center md:justify-start gap-8 mb-6 border-y border-white/5 py-4">
                            <div className="text-center md:text-left">
                                <span className="block text-xl font-bold text-white">{user.stats.postCount}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-mono">Postingan</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-xl font-bold text-white">{user.stats.followers}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-mono">Pengikut</span>
                            </div>
                            <div className="text-center md:text-left">
                                <span className="block text-xl font-bold text-white">{user.stats.following}</span>
                                <span className="text-[10px] text-slate-500 uppercase font-mono">Mengikuti</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <p className="text-blue-400 font-mono text-sm mb-1 hover:underline cursor-pointer">@{user.username}</p>
                                <p className="text-slate-300 text-sm whitespace-pre-wrap">{user.bio || 'Belum ada bio...'}</p>
                            </div>
                            <div className="flex items-center gap-2 text-slate-500 text-[10px] uppercase font-mono">
                                <Calendar size={12} />
                                bergabung {new Date(user.created_at).toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid Postingan */}
            <div className="border-t border-white/10 pt-8">
                <div className="flex items-center gap-2 mb-8 uppercase tracking-widest text-xs font-bold text-slate-500">
                    <Grid size={16} /> Postingan Saya
                </div>

                {posts.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                        <Grid size={48} className="mx-auto mb-4 opacity-20" />
                        <p className="text-slate-500">Belum ada postingan untuk ditampilkan</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {posts.map((post) => (
                            <motion.div 
                                key={post.id} 
                                whileHover={{ scale: 1.02 }}
                                className="aspect-square bg-slate-800 rounded-2xl overflow-hidden relative group cursor-pointer border border-white/5 shadow-xl"
                            >
                                {post.image_url ? (
                                    <img src={post.image_url} alt="Post" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full p-4 text-xs text-slate-400 line-clamp-6 bg-gradient-to-br from-slate-800 to-slate-900">
                                        {post.content}
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-blue-600/60 flex items-center justify-center gap-6 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <Heart size={20} fill="white" /> {post.likesCount || 0}
                                    </div>
                                    <div className="flex items-center gap-2 text-white font-bold">
                                        <MessageCircle size={20} fill="white" /> {post.commentsCount || 0}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;
