import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { FileText, AlertTriangle, Trash2, Eye, Filter } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';

const AdminPosts: React.FC = () => {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchPosts = async () => {
        try {
            const res = await api.get('/admin/posts');
            setPosts(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handleDelete = async (postId: number) => {
        if (!confirm('Hapus konten ini secara permanen?')) return;

        try {
            await api.delete(`/admin/posts/${postId}`);
            setPosts(posts.filter(p => p.id !== postId));
        } catch (err) {
            alert('Gagal menghapus postingan');
        }
    };

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Audit Konten</h1>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Filtering All Global Activity</p>
            </header>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-tight shadow-lg shadow-slate-900/10">
                        SEMUA POSTINGAN
                    </button>
                    <button className="flex items-center gap-2 px-6 py-2 bg-white text-slate-500 border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-tight hover:bg-slate-50">
                        BERLAPORAN (0)
                    </button>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {loading ? (
                        <div className="col-span-full py-20 text-center animate-pulse uppercase font-bold text-slate-400">Loading Nodes...</div>
                    ) : (
                        <AnimatePresence>
                            {posts.map((post) => (
                                <motion.div 
                                    layout
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    key={post.id} 
                                    className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-all group"
                                >
                                    {post.image_url && (
                                        <div className="h-40 overflow-hidden relative border-b border-slate-200">
                                            <img src={post.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            <div className="absolute top-2 right-2 bg-black/60 text-white px-2 py-1 rounded text-[9px] font-bold uppercase backdrop-blur-sm">IMAGE_NODAL</div>
                                        </div>
                                    )}
                                    <div className="p-5 flex-1">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 bg-white rounded-md border border-slate-200"></div>
                                                <span className="text-[10px] font-black text-slate-900 uppercase">@{post.username}</span>
                                            </div>
                                            <span className="text-[9px] font-mono text-slate-400">{new Date(post.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600 text-xs leading-relaxed line-clamp-4 bg-white p-3 rounded-xl border border-slate-100">
                                            {post.content}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-white border-t border-slate-200 flex justify-between items-center">
                                        <div className="flex gap-4">
                                            <div className="text-center">
                                                <span className="block text-[10px] font-bold text-slate-900">12</span>
                                                <span className="text-[8px] text-slate-400 uppercase font-mono">Likes</span>
                                            </div>
                                            <div className="text-center">
                                                <span className="block text-[10px] font-bold text-rose-600">0</span>
                                                <span className="text-[8px] text-slate-400 uppercase font-mono">Flags</span>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"><Eye size={16} /></button>
                                            <button 
                                                onClick={() => handleDelete(post.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPosts;
