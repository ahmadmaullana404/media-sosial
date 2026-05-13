import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Mail, Lock, ArrowRight, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'motion/react';

const Login: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        
        try {
            const res = await api.post('/auth/login', { username, password });
            login(res.data.token, res.data.user);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || err.message || 'Gagal login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0c] flex items-center justify-center p-4 md:p-10 font-sans">
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-[#12141a] border border-white/5 rounded-[2.5rem] shadow-2xl overflow-hidden relative z-10"
            >
                {/* Left Side: Branding/Visual */}
                <div className="hidden md:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
                    {/* Decorative Patterns */}
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <Sparkles size={200} className="rotate-12" />
                    </div>
                    
                    <div className="relative z-20">
                        <div className="flex items-center gap-3 mb-10">
                            <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center">
                                <Users className="text-white" size={24} />
                            </div>
                            <span className="text-xl font-black text-white tracking-widest uppercase">SocialHub</span>
                        </div>
                        
                        <h2 className="text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-6">
                            Terhubung & <br />Berbagi <span className="text-blue-200">Momen</span> Terbaik.
                        </h2>
                        <p className="text-blue-100/70 text-lg max-w-sm leading-relaxed">
                            Platform media sosial generasi terbaru yang fokus pada interaksi real-time dan privasi pengguna.
                        </p>
                    </div>

                    <div className="relative z-20 flex gap-10">
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white">10K+</span>
                            <span className="text-xs text-blue-100/50 uppercase tracking-widest">Aktif User</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-2xl font-black text-white">50K+</span>
                            <span className="text-xs text-blue-100/50 uppercase tracking-widest">Stories</span>
                        </div>
                    </div>

                    {/* Gradient Overlay for extra sauce */}
                    <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-16 flex flex-col justify-center bg-[#12141a]">
                    <div className="mb-10 text-center md:text-left">
                        <h1 className="text-4xl font-black text-white tracking-tight leading-none mb-3 font-display bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">Log In</h1>
                        <p className="text-slate-500 font-medium text-lg">Pintu gerbang untuk berinteraksi.</p>
                    </div>

                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm p-4 rounded-2xl mb-8 flex items-center gap-3"
                        >
                            <ShieldCheck size={18} />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Username</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Users size={20} />
                                </div>
                                <input 
                                    type="text" 
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-[#1a1d25] border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600"
                                    placeholder="username_anda"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] ml-1">Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-500 group-focus-within:text-blue-500 transition-colors">
                                    <Lock size={20} />
                                </div>
                                <input 
                                    type="password" 
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-[#1a1d25] border border-white/5 focus:border-blue-500/50 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all placeholder:text-slate-600"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-3 group mt-4 disabled:opacity-50 disabled:grayscale"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    MEMPROSES...
                                </span>
                            ) : (
                                <>
                                    MASUK SEKARANG
                                    <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center">
                        <span className="text-slate-500">Belum memiliki akun? </span>
                        <Link to="/register" className="text-white hover:text-blue-400 font-black transition-colors underline decoration-blue-500/30 underline-offset-4">Daftar Akun Baru</Link>
                    </div>

                    <div className="mt-auto pt-10 text-center opacity-30 text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                        SocialHub v2.0 &copy; 2026 AI-Build
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
