import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarDays,
  Home,
  Inbox,
  LayoutDashboard,
  LogOut,
  Users
} from 'lucide-react';

const links = [
  ['/', 'Dashboard', LayoutDashboard],
  ['/properties', 'Properties', Home],
  ['/appointments', 'Appointments', CalendarDays],
  ['/inquiries', 'Inquiries', Inbox],
  ['/users', 'Users', Users]
];

export default function Sidebar() {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem('margalla_admin_token');
    localStorage.removeItem('margalla_admin_user');
    navigate('/login');
  }

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 border-r border-white/10 bg-estate-950/95 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl lg:block">
      
      <div className="mb-10 flex items-center gap-4 rounded-[1.7rem] border border-white/10 bg-white/[0.04] p-3">
        <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-gold-400/40 shadow-lg shadow-gold-400/20">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop"
            alt="Margalla Estates"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>

        <div className="leading-tight">
          <h2 className="text-base font-black uppercase tracking-[0.12em] text-[#F4C95D]">
            Margalla Estates
          </h2>
          <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            Islamabad Premium Realty
          </p>
        </div>
      </div>

      <nav className="grid gap-2">
        {links.map(([to, label, Icon]) => (
          <NavLink
            key={to}
            end={to === '/'}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-4 py-3 font-bold transition ${
                isActive
                  ? 'bg-[#F4C95D] text-estate-950 shadow-lg shadow-gold-400/20'
                  : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={logout}
        className="absolute bottom-5 left-5 right-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-slate-200 transition hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
      >
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}