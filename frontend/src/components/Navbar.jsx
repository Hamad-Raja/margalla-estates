import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const links = [
  ['/', 'Home'],
  ['/properties', 'Properties'],
  ['/about', 'About'],
  ['/contact', 'Contact']
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-estate-950/90 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-4">
          <div className="relative h-14 w-14 overflow-hidden rounded-2xl border border-gold-400/40 shadow-lg shadow-gold-400/20">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop"
              alt="Margalla Estates"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>

          <div className="leading-tight">
            <h1 className="text-xl font-black uppercase tracking-[0.12em] text-[#F4C95D] sm:text-2xl">
              Margalla Estates
            </h1>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
              Islamabad Premium Realty
            </p>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-8 lg:flex">
          {links.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `text-sm font-bold transition ${
                  isActive
                    ? 'text-[#F4C95D]'
                    : 'text-slate-200 hover:text-[#F4C95D]'
                }`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition hover:border-[#F4C95D]/50 hover:text-[#F4C95D]"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-full bg-[#F4C95D] px-5 py-2.5 text-sm font-bold text-estate-950 transition hover:scale-[1.02]"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/auth"
              className="rounded-full bg-[#F4C95D] px-6 py-2.5 text-sm font-bold text-estate-950 transition hover:scale-[1.02]"
            >
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile Button */}
        <button
          onClick={() => setOpen(!open)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="border-t border-white/10 bg-estate-950 px-4 py-5 lg:hidden">
          <div className="flex flex-col gap-4">
            {links.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-2xl px-4 py-3 font-bold transition ${
                    isActive
                      ? 'bg-white/10 text-[#F4C95D]'
                      : 'text-slate-200 hover:bg-white/5 hover:text-[#F4C95D]'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}

            {user ? (
              <>
                <Link
                  onClick={() => setOpen(false)}
                  to="/dashboard"
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-center font-bold text-white"
                >
                  Dashboard
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-2xl bg-[#F4C95D] px-4 py-3 text-center font-bold text-estate-950"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                onClick={() => setOpen(false)}
                to="/auth"
                className="rounded-2xl bg-[#F4C95D] px-4 py-3 text-center font-bold text-estate-950"
              >
                Login / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}