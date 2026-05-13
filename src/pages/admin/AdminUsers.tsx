import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { User, ShieldAlert, ShieldCheck, Search, Trash2, ExternalLink } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    const fetchUsers = async () => {
        try {
            const res = await api.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleBanned = async (userId: number, currentStatus: string) => {
        const action = currentStatus === 'banned' ? 'unban' : 'ban';
        if (!confirm(`Apakah Anda yakin ingin ${action} user ini?`)) return;

        try {
            await api.put(`/admin/users/${userId}/status`, { status: currentStatus === 'banned' ? 'active' : 'banned' });
            fetchUsers();
        } catch (err) {
            alert('Gagal mengubah status user');
        }
    };

    const changeRole = async (userId: number, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'user' : 'admin';
        if (!confirm(`Ubah role user ini menjadi ${newRole}?`)) return;

        try {
            await api.put(`/admin/users/${userId}/role`, { role: newRole });
            fetchUsers();
        } catch (err) {
            alert('Gagal mengubah role user');
        }
    };

    const deleteUser = async (userId: number) => {
        if (!confirm('HAPUS USER INI SECARA PERMANEN? Semua data user (posts, likes, comments) akan hilang!')) return;

        try {
            await api.delete(`/admin/users/${userId}`);
            fetchUsers();
        } catch (err) {
            alert('Gagal menghapus user');
        }
    };

    const filteredUsers = users.filter(u => 
        u.username.toLowerCase().includes(search.toLowerCase()) || 
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8 bg-[#f8fafc] min-h-screen">
            <header className="mb-10">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Manajemen Pengguna</h1>
                <p className="text-slate-500 font-mono text-xs uppercase tracking-widest mt-1">Total Entitas: {users.length}</p>
            </header>

            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input 
                            type="text" 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="CARI USERNAME / EMAIL..."
                            className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-3 pl-12 pr-4 text-xs font-bold font-mono focus:outline-none focus:border-blue-500 transition-all"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr className="text-left text-slate-400 font-bold uppercase text-[10px] tracking-widest">
                                <th className="px-6 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Bergabung</th>
                                <th className="px-6 py-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr><td colSpan={5} className="px-6 py-8 text-center animate-pulse">MEMUAT DATABASE...</td></tr>
                            ) : filteredUsers.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 overflow-hidden">
                                                {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <User size={20} />}
                                            </div>
                                            <div>
                                                <span className="block font-bold text-slate-900">@{u.username}</span>
                                                <span className="text-[10px] text-slate-500 font-mono">{u.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button 
                                            onClick={() => changeRole(u.id, u.role)}
                                            className={cn(
                                                "text-[10px] font-black uppercase px-2 py-1 rounded-md border transition-all hover:scale-105",
                                                u.role === 'admin' ? "bg-rose-50 text-rose-600 border-rose-100" : "bg-blue-50 text-blue-600 border-blue-100"
                                            )}
                                        >
                                            {u.role}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            <div className={cn("w-2 h-2 rounded-full", u.status === 'active' ? "bg-emerald-500" : "bg-rose-500")}></div>
                                            <span className="text-[10px] font-bold uppercase text-slate-600">{u.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-500 font-mono text-[10px]">
                                        {new Date(u.created_at).toLocaleDateString('id-ID')}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button 
                                                title="Lihat Profil"
                                                onClick={() => window.open(`/profile/${u.username}`, '_blank')}
                                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                            >
                                                <ExternalLink size={16} />
                                            </button>
                                            <button 
                                                onClick={() => toggleBanned(u.id, u.status)}
                                                className={cn(
                                                    "p-2 rounded-lg transition-all",
                                                    u.status === 'banned' ? "text-emerald-500 hover:bg-emerald-50" : "text-rose-500 hover:bg-rose-50"
                                                )}
                                                title={u.status === 'banned' ? 'Unban' : 'Ban'}
                                            >
                                                {u.status === 'banned' ? <ShieldCheck size={16} /> : <ShieldAlert size={16} />}
                                            </button>
                                            <button 
                                                onClick={() => deleteUser(u.id)}
                                                className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-100 rounded-lg transition-all"
                                                title="Hapus Permanen"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminUsers;
