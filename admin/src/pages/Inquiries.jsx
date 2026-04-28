import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Inbox, MailOpen, Search, Trash2 } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';

export default function Inquiries() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/inquiries');
    setItems(data);
  }

  useEffect(() => {
    load()
      .catch(() => toast.error('Failed to load inquiries'))
      .finally(() => setLoading(false));
  }, []);

  async function mark(id, read) {
    try {
      await api.patch(`/inquiries/${id}/read`, { read });
      toast.success(read ? 'Marked as read' : 'Marked as unread');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  }

  async function remove(id) {
    if (!window.confirm('Delete this inquiry?')) return;

    try {
      await api.delete(`/inquiries/${id}`);
      toast.success('Inquiry deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  }

  const filtered = useMemo(() => {
    return items.filter((i) => {
      const text = `${i.subject} ${i.name} ${i.email} ${i.phone} ${i.message}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesFilter =
        filter === 'All' || (filter === 'Unread' && !i.read) || (filter === 'Read' && i.read);

      return matchesQuery && matchesFilter;
    });
  }, [items, query, filter]);

  const unreadCount = items.filter((i) => !i.read).length;

  return (
    <main className="p-5 sm:p-8">
      <Header
        title="Inquiries"
        subtitle="Manage messages from buyers, sellers and investors professionally."
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Inquiries" value={items.length} icon={Inbox} />
        <SummaryCard label="Unread Messages" value={unreadCount} icon={MailOpen} />
        <SummaryCard label="Read Messages" value={items.length - unreadCount} icon={MailOpen} />
      </section>

      <section className="glass mb-6 rounded-[2rem] p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              className="input-dark w-full pl-11"
              placeholder="Search inquiries by subject, name, email or message..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select className="input-dark" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option>All</option>
            <option>Unread</option>
            <option>Read</option>
          </select>
        </div>
      </section>

      <section className="grid gap-4">
        {loading ? (
          <EmptyState text="Loading inquiries..." />
        ) : filtered.length ? (
          filtered.map((i) => (
            <div
              className={`glass rounded-[2rem] p-5 transition hover:border-gold-400/40 ${
                !i.read ? 'border-gold-400/60' : ''
              }`}
              key={i._id}
            >
              <div className="flex flex-col justify-between gap-5 xl:flex-row">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-xl font-black text-white">{i.subject}</p>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${
                        i.read
                          ? 'bg-white/10 text-slate-300'
                          : 'bg-gold-300/10 text-gold-300'
                      }`}
                    >
                      {i.read ? 'Read' : 'Unread'}
                    </span>
                  </div>

                  <p className="mt-2 text-sm text-slate-400">
                    {i.name} · {i.email} · {i.phone}
                  </p>

                  <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 leading-7 text-slate-300">
                    {i.message}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap gap-2 xl:flex-col">
                  <button className="btn-secondary" onClick={() => mark(i._id, !i.read)}>
                    {i.read ? 'Mark unread' : 'Mark read'}
                  </button>

                  <button
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-500/20 px-4 py-2 font-bold text-red-200 transition hover:bg-red-500/30"
                    onClick={() => remove(i._id)}
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <EmptyState text="No inquiries match your filters." />
        )}
      </section>
    </main>
  );
}

function SummaryCard({ label, value, icon: Icon }) {
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