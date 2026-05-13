import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'motion/react';

const AdminLogin: React.FC = () => {
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
            if (res.data.user.role !== 'admin') {
                throw new Error('Akses ditolak. Anda bukan Admin.');
            }
            login(res.data.token, res.data.user);
            navigate('/admin/dashboard');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-10 shadow-2xl shadow-slate-200/50"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mb-4 text-rose-600 border border-rose-100">
                        <ShieldAlert size={40} />
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">SocialHub <span className="text-rose-600">Admin</span></h1>
                    <p className="text-slate-500 text-sm mt-1 font-medium">Panel Kendali Keamanan Sistem</p>
                </div>

                {error && (
                    <div className="bg-rose-50 border border-rose-100 text-rose-600 text-xs p-4 rounded-xl mb-6 font-bold flex items-center gap-2">
                        <ShieldAlert size={16} /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Admin Username</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono text-sm"
                            placeholder="admin_username"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Master Password</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-4 px-5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all font-mono text-sm"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-rose-600/20 flex items-center justify-center gap-2 group disable:opacity-50 mt-4 uppercase tracking-widest text-sm"
                    >
                        {loading ? 'AUTHENTICATING...' : 'LOGIN TO DASHBOARD'}
                        {!loading && <ArrowRight size={18} />}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
