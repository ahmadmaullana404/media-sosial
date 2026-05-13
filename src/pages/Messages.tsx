import React from 'react';
import { Mail, Search, User, Send } from 'lucide-react';

const Messages: React.FC = () => {
    return (
        <div className="h-screen flex flex-col">
            <div className="flex-1 flex overflow-hidden">
                {/* User List */}
                <div className="w-full md:w-80 border-r border-white/10 flex flex-col bg-[#12141a]/50">
                    <div className="p-6 border-b border-white/10">
                        <h2 className="text-xl font-bold text-white uppercase tracking-tighter mb-4">Pesan</h2>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                            <input className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs font-mono" placeholder="CARI KONTAK..." />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-2">
                        <div className="p-3 bg-blue-600/10 border border-blue-500/20 rounded-2xl flex items-center gap-3">
                            <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-slate-500"><User size={20}/></div>
                            <div>
                                <h4 className="text-sm font-bold text-white">Admin Hub</h4>
                                <p className="text-[10px] text-blue-400">Selamat datang di SocialHub!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="hidden md:flex flex-1 flex-col bg-black/20">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#0a0a0c]">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-slate-800 rounded-lg"></div>
                            <span className="font-bold text-white uppercase text-sm tracking-widest">Admin Hub</span>
                        </div>
                    </div>
                    <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                        <div className="flex justify-start">
                            <div className="bg-white/10 p-4 rounded-2xl rounded-tl-none max-w-md text-sm leading-relaxed">
                                Halo! Ini adalah preview sistem chat real-time. Full integrasi akan tersedia di Sesi 4.
                            </div>
                        </div>
                    </div>
                    <div className="p-6 border-t border-white/10 bg-[#0a0a0c]">
                        <div className="flex gap-4">
                            <input className="flex-1 bg-white/5 border border-white/10 rounded-2xl py-3 px-6 text-sm" placeholder="TULIS PESAN ANDA..." />
                            <button className="bg-blue-600 p-3 rounded-2xl text-white hover:scale-105 active:scale-95 transition-all">
                                <Send size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Messages;
