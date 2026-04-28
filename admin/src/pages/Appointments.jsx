import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { CalendarDays, CheckCircle2, Clock, Search, XCircle } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';

const statuses = ['Pending', 'Confirmed', 'Completed', 'Cancelled'];

export default function Appointments() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/appointments');
    setItems(data);
  }

  useEffect(() => {
    load()
      .catch(() => toast.error('Failed to load appointments'))
      .finally(() => setLoading(false));
  }, []);

  async function update(id, status) {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      toast.success('Status updated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  }

  const filtered = useMemo(() => {
    return items.filter((a) => {
      const text = `${a.name} ${a.email} ${a.phone} ${a.property?.title} ${a.status}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [items, query, statusFilter]);

  const summary = {
    total: items.length,
    pending: items.filter((a) => a.status === 'Pending').length,
    confirmed: items.filter((a) => a.status === 'Confirmed').length,
    completed: items.filter((a) => a.status === 'Completed').length,
    cancelled: items.filter((a) => a.status === 'Cancelled').length,
  };

  return (
    <main className="p-5 sm:p-8">
      <Header
        title="Appointments"
        subtitle="Manage private viewings, buyer visits and property consultation requests."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard label="Total" value={summary.total} icon={CalendarDays} />
        <StatCard label="Pending" value={summary.pending} icon={Clock} />
        <StatCard label="Confirmed" value={summary.confirmed} icon={CheckCircle2} />
        <StatCard label="Completed" value={summary.completed} icon={CheckCircle2} />
        <StatCard label="Cancelled" value={summary.cancelled} icon={XCircle} />
      </section>

      <section className="glass mb-6 rounded-[2rem] p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              className="input-dark w-full pl-11"
              placeholder="Search by name, email, phone or property..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="input-dark"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All</option>
            {statuses.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-4">
        {loading ? (
          <EmptyState text="Loading appointments..." />
        ) : filtered.length ? (
          filtered.map((a) => (
            <div className="glass rounded-[2rem] p-5 transition hover:border-gold-400/40" key={a._id}>
              <div className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-black text-white">{a.name}</p>
                    <span className="rounded-full bg-gold-300/10 px-3 py-1 text-xs font-bold text-gold-300">
                      {a.status}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {a.email} · {a.phone}
                  </p>

                  <div className="mt-4 rounded-2xl bg-white/5 p-4">
                    <p className="font-bold text-white">{a.property?.title || 'No property selected'}</p>
                    <p className="mt-1 text-sm text-slate-400">
                      {a.preferredDate
                        ? new Date(a.preferredDate).toLocaleDateString()
                        : 'No date'}{' '}
                      at {a.preferredTime || 'No time'}
                    </p>
                  </div>

                  {a.message && (
                    <p className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 text-sm leading-6 text-slate-300">
                      {a.message}
                    </p>
                  )}
                </div>

                <div className="w-full xl:w-72">
                  <label className="mb-2 block text-xs font-black uppercase tracking-[0.2em] text-slate-500">
                    Appointment Status
                  </label>
                  <select
                    className="input-dark w-full"
                    value={a.status}
                    onChange={(e) => update(a._id, e.target.value)}
                  >
                    {statuses.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No appointments match your filters." />
        )}
      </section>
    </main>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="glass rounded-[2rem] p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="mt-1 text-2xl font-black text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-white/10 p-3 text-gold-300">
          <Icon size={20} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ text }) {
  return (
    <div className="glass rounded-[2rem] p-10 text-center text-slate-400">
      {text}
    </div>
  );
}