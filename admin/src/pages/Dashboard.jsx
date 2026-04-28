import React, { useEffect, useMemo, useState } from 'react';
import {
  CalendarDays,
  Home,
  Inbox,
  Star,
  Users,
  Wallet,
  TrendingUp,
  Activity,
  Building2,
  Clock,
} from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { formatPKR } from '../utils/format';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const c = stats?.cards || {};

  const cards = useMemo(
    () => [
      {
        label: 'Total Properties',
        value: c.properties || 0,
        icon: Home,
        hint: 'Active real estate listings',
      },
      {
        label: 'Registered Users',
        value: c.users || 0,
        icon: Users,
        hint: 'Buyers and admin accounts',
      },
      {
        label: 'Appointments',
        value: c.appointments || 0,
        icon: CalendarDays,
        hint: 'Private viewing requests',
      },
      {
        label: 'Inquiries',
        value: c.inquiries || 0,
        icon: Inbox,
        hint: 'Buyer and seller messages',
      },
      {
        label: 'Featured Listings',
        value: c.featured || 0,
        icon: Star,
        hint: 'Premium promoted properties',
      },
      {
        label: 'Inventory Value',
        value: formatPKR(c.inventoryValue || 0),
        icon: Wallet,
        hint: 'Estimated total listing value',
      },
    ],
    [c]
  );

  return (
    <main className="p-5 sm:p-8">
      <Header
        title="Executive Dashboard"
        subtitle="Professional overview of your Islamabad real estate operations."
      />

      <section className="mb-8 grid gap-5 xl:grid-cols-3">
        <div className="glass rounded-[2rem] p-6 xl:col-span-2">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-gold-300">
                Platform Performance
              </p>
              <h1 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Real estate control center
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
                Monitor listings, users, inquiries, appointments, featured inventory and sector-wise property distribution from one clean admin command center.
              </p>
            </div>

            <div className="rounded-[2rem] bg-white/5 p-5">
              <Activity className="mb-3 text-gold-300" />
              <p className="text-sm text-slate-400">System Status</p>
              <p className="mt-1 text-xl font-black text-emerald-300">Operational</p>
            </div>
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Featured Ratio</p>
              <p className="mt-2 text-3xl font-black">
                {c.properties ? Math.round(((c.featured || 0) / c.properties) * 100) : 0}%
              </p>
            </div>
            <div className="rounded-2xl bg-gold-300/10 p-4 text-gold-300">
              <TrendingUp />
            </div>
          </div>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Percentage of properties currently marked as featured.
          </p>
        </div>
      </section>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, hint }) => (
          <div
            className="glass group rounded-[2rem] p-6 transition hover:-translate-y-1 hover:border-gold-400/40"
            key={label}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-black text-white">{loading ? '...' : value}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-3 text-gold-300 transition group-hover:bg-gold-300/20">
                <Icon size={22} />
              </div>
            </div>
            <p className="mt-5 text-sm text-slate-500">{hint}</p>
          </div>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <div className="glass rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Recent Appointments</h2>
              <p className="mt-1 text-sm text-slate-400">Latest private viewing requests.</p>
            </div>
            <Clock className="text-gold-300" />
          </div>

          <div className="grid gap-3">
            {(stats?.recentAppointments || []).length ? (
              stats.recentAppointments.map((a) => (
                <div
                  key={a._id}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:bg-white/10"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-bold text-white">{a.name}</p>
                      <p className="mt-1 text-sm text-slate-400">{a.property?.title || 'No property linked'}</p>
                    </div>
                    <span className="rounded-full bg-gold-300/10 px-3 py-1 text-xs font-bold text-gold-300">
                      {a.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <EmptyState text="No recent appointments found." />
            )}
          </div>
        </div>

        <div className="glass rounded-[2rem] p-6">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-white">Properties by Sector</h2>
              <p className="mt-1 text-sm text-slate-400">Distribution of inventory across Islamabad.</p>
            </div>
            <Building2 className="text-gold-300" />
          </div>

          <div className="grid gap-3">
            {(stats?.sectorStats || []).length ? (
              stats.sectorStats.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <span className="font-bold text-white">{s._id || 'Unknown Sector'}</span>
                  <b className="rounded-full bg-white/10 px-3 py-1 text-gold-300">{s.count}</b>
                </div>
              ))
            ) : (
              <EmptyState text="No sector data available." />
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function EmptyState({ text }) {
  return (
    <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-6 text-center text-sm text-slate-400">
      {text}
    </div>
  );
}