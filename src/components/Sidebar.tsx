import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Search, Bell, Mail, User, LogOut, Compass, PlusSquare, ShieldAlert } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { cn } from '../lib/utils';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Beranda', path: '/', icon: Home },
    { name: 'Cari', path: '/search', icon: Search },
    { name: 'Jelajah', path: '/explore', icon: Compass },
    { name: 'Notifikasi', path: '/notifications', icon: Bell },
    { name: 'Pesan', path: '/messages', icon: Mail },
    { name: 'Profil', path: `/profile/${user?.id}`, icon: User },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Hub', path: '/admin/dashboard', icon: ShieldAlert });
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-white/5 p-2 md:relative md:w-64 md:h-screen md:border-t-0 md:border-r md:p-6 flex flex-col z-50">
      <div className="hidden md:flex items-center gap-2 mb-10">
        <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(100,149,237,0.4)]">S</div>
        <h1 className="text-xl font-bold tracking-tighter text-white uppercase font-display">SocialHub</h1>
      </div>

      <nav className="flex md:flex-col justify-around md:justify-start gap-1 md:gap-2 w-full">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-4 p-3 rounded-xl transition-all group hover:bg-white/5",
              isActive ? "text-blue-500 font-bold" : "text-slate-400"
            )}
          >
            <item.icon size={24} className={cn("transition-transform group-active:scale-95")} />
            <span className="hidden md:block text-sm">{item.name}</span>
          </NavLink>
        ))}
        
        <button 
          onClick={handleLogout}
          className="flex items-center gap-4 p-3 rounded-xl transition-all text-rose-500 hover:bg-rose-500/10 mt-auto"
        >
          <LogOut size={24} />
          <span className="hidden md:block text-sm">Keluar</span>
        </button>
      </nav>
    </aside>
  );
};
