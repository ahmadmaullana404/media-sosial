import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Users, FileText, AlertOctagon, TrendingUp, UserPlus, ShieldX, CheckCircle, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<any>(null);
    const [reports, setReports] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const navigate = useNavigate();

    const fetchAllData = async () => {
        try {
            const [statsRes, reportsRes] = await Promise.all([
                api.get('/admin/stats'),
                api.get('/admin/reports')
            ]);
            setStats(statsRes.data);
            setReports(reportsRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // Double check admin role
        if (!user || user.role !== 'admin') {
            navigate('/admin/login');
            return;
        }

        fetchAllData();
    }, [user, navigate]);

    const handleReportStatus = async (reportId: number, status: string) => {
        try {
            await api.put(`/admin/reports/${reportId}/status`, { status });
            fetchAllData();
        } catch (err) {
            alert('Gagal update status laporan');
        }
    };

    if (loading) return <div className="p-20 text-center font-mono animate-pulse">SYSTEM_LOADING...</div>;

    const cards = [
        { label: 'Total Pengguna', value: stats.userCount, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
        { label: 'Total Postingan', value: stats.postCount, icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Laporan Pending', value: stats.reportCount, icon: AlertOctagon, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Health Score', value: '98%', icon: TrendingUp, color: 'text-rose-600', bg: 'bg-rose-50' },
    ];

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen">
            <header className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Admin Dashboard</h1>
                    <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Sistem Kontrol SocialHub v1.0</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-white border border-slate-200 px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-tight hover:bg-slate-50 transition-colors">Generate Report</button>
                    <button className="bg-rose-600 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-tight hover:bg-rose-700 shadow-lg shadow-rose-600/20 transition-all">Emergency Lockdown</button>
                </div>
            </header>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {cards.map((card, i) => (
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        key={card.label} 
                        className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
                    >
                        <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">{card.label}</span>
                            <span className="text-3xl font-black text-slate-900 font-mono">{card.value}</span>
                        </div>
                        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center", card.bg, card.color)}>
                            <card.icon size={28} />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Reports Mockup */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                        <h3 className="font-bold text-slate-800 uppercase tracking-tight flex items-center gap-2">
                             <AlertOctagon size={16} className="text-rose-500" /> Laporan Terbaru
                        </h3>
                        <button className="text-[10px] font-bold text-blue-600 hover:underline uppercase">Lihat Semua</button>
                    </div>
                    <div className="p-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-slate-400 font-bold uppercase text-[10px] border-b border-slate-100">
                                    <th className="px-4 py-3">Pelapor</th>
                                    <th className="px-4 py-3">Alasan</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {reports.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-4 py-10 text-center text-slate-400 italic">Bersih. Tidak ada laporan terpending.</td>
                                    </tr>
                                ) : reports.slice(0, 5).map((r: any) => (
                                    <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-4 py-4">
                                            <span className="font-bold text-slate-800 text-xs">@{r.reporter_name}</span>
                                        </td>
                                        <td className="px-4 py-4">
                                            <div className="max-w-[200px]">
                                                <span className="block text-[10px] font-bold text-slate-900 truncate">Post by @{r.post_author}</span>
                                                <span className="text-[10px] text-slate-500 italic">"{r.reason}"</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4">
                                            <span className={cn(
                                                "text-[9px] font-black uppercase px-2 py-0.5 rounded-full",
                                                r.status === 'pending' ? "bg-orange-100 text-orange-600" : 
                                                r.status === 'resolved' ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-600"
                                            )}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 text-right">
                                            <div className="flex justify-end gap-1">
                                                {r.status === 'pending' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleReportStatus(r.id, 'resolved')}
                                                            className="p-1.5 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-all"
                                                            title="Tandai Selesai"
                                                        >
                                                            <CheckCircle size={14} />
                                                        </button>
                                                        <button 
                                                            onClick={() => handleReportStatus(r.id, 'ignored')}
                                                            className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
                                                            title="Abaikan"
                                                        >
                                                            <Trash2 size={14} />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                         <h3 className="font-bold text-slate-800 uppercase tracking-tight mb-6 flex items-center gap-2">
                             <TrendingUp size={16} className="text-blue-500" /> Shortcut Admin
                        </h3>
                        <div className="grid grid-cols-1 gap-3">
                            <button className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group">
                                <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <UserPlus size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-slate-800 text-xs">Verify Users</span>
                                    <span className="text-[10px] text-slate-500">3 user butuh verifikasi</span>
                                </div>
                            </button>
                            <button className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 group">
                                <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <ShieldX size={18} />
                                </div>
                                <div className="text-left">
                                    <span className="block font-bold text-slate-800 text-xs">Security Log</span>
                                    <span className="text-[10px] text-slate-500">Cek percobaan login mencurigakan</span>
                                </div>
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#1e293b] p-6 rounded-3xl text-white shadow-xl shadow-slate-900/10">
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Sistem Status</h4>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-300">API Latency</span>
                                <span className="font-mono text-xs text-emerald-400">14ms [OK]</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-300">Database Connection</span>
                                <span className="font-mono text-xs text-emerald-400">ACTIVE</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-slate-300">Storage Usage</span>
                                <span className="font-mono text-xs text-blue-400">4.2 GB / 50 GB</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
