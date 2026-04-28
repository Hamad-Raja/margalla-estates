import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Edit, Plus, Search, Star, Trash2, Building2 } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';
import { formatPKR } from '../utils/format';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/properties', { params: { limit: 100 } });
    setProperties(data.items || []);
  }

  useEffect(() => {
    load()
      .catch(() => toast.error('Failed to load properties'))
      .finally(() => setLoading(false));
  }, []);

  async function remove(id) {
    if (!window.confirm('Delete this property?')) return;

    try {
      await api.delete(`/properties/${id}`);
      toast.success('Property deleted');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    }
  }

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      const text = `${p.title} ${p.location} ${p.sector} ${p.type} ${p.status}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesType = typeFilter === 'All' || p.type === typeFilter;
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter;

      return matchesQuery && matchesType && matchesStatus;
    });
  }, [properties, query, typeFilter, statusFilter]);

  const types = ['All', ...new Set(properties.map((p) => p.type).filter(Boolean))];
  const statuses = ['All', ...new Set(properties.map((p) => p.status).filter(Boolean))];

  return (
    <main className="p-5 sm:p-8">
      <Header
        title="Property Management"
        subtitle="Create, edit and manage premium Islamabad listings."
        action={
          <Link className="btn-primary flex items-center gap-2" to="/properties/new">
            <Plus size={18} />
            Add Property
          </Link>
        }
      />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Listings" value={properties.length} icon={Building2} />
        <SummaryCard label="Featured" value={properties.filter((p) => p.featured).length} icon={Star} />
        <SummaryCard label="Visible Results" value={filtered.length} icon={Search} />
      </section>

      <section className="glass mb-6 rounded-[2rem] p-4">
        <div className="grid gap-4 xl:grid-cols-[1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              className="input-dark w-full pl-11"
              placeholder="Search by title, location, sector, type or status..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="input-dark"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            {types.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>

          <select
            className="input-dark"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="glass overflow-hidden rounded-[2rem]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">Listing Inventory</h2>
          <p className="mt-1 text-sm text-slate-400">
            Review property details, pricing, visibility and actions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left">
            <thead className="bg-white/10 text-sm text-slate-300">
              <tr>
                <th className="p-4">Property</th>
                <th>Sector</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Featured</th>
                <th>Premium</th>
                <th className="pr-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-400">
                    Loading properties...
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((p) => (
                  <tr key={p._id} className="border-t border-white/10 transition hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={p.images?.[0]}
                          alt={p.title}
                          className="h-16 w-24 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-bold text-white">{p.title}</p>
                          <p className="mt-1 max-w-xs truncate text-xs text-slate-400">{p.location}</p>
                        </div>
                      </div>
                    </td>

                    <td className="text-slate-300">{p.sector}</td>
                    <td className="text-slate-300">{p.type}</td>
                    <td className="font-bold text-gold-300">{p.priceLabel || formatPKR(p.price)}</td>
                    <td>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                        {p.status}
                      </span>
                    </td>
                    <td>{p.featured ? 'Yes' : 'No'}</td>
                    <td>{p.premium ? 'Yes' : 'No'}</td>
                    <td className="pr-4 text-right">
                      <Link
                        className="mr-3 inline-flex rounded-xl bg-white/10 p-2 text-slate-200 transition hover:bg-gold-300/20 hover:text-gold-300"
                        to={`/properties/${p._id}/edit`}
                      >
                        <Edit size={16} />
                      </Link>

                      <button
                        className="inline-flex rounded-xl bg-red-500/20 p-2 text-red-200 transition hover:bg-red-500/30"
                        onClick={() => remove(p._id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="p-10 text-center text-slate-400">
                    No properties match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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