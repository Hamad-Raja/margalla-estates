import React, { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Search, ShieldCheck, UserCheck, Users as UsersIcon } from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  async function load() {
    const { data } = await api.get('/auth/users');
    setUsers(data);
  }

  useEffect(() => {
    load()
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false));
  }, []);

  async function toggle(user) {
    try {
      await api.patch(`/auth/users/${user._id}/status`, { isActive: !user.isActive });
      toast.success(user.isActive ? 'User deactivated' : 'User activated');
      load();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  }

  const filtered = useMemo(() => {
    return users.filter((u) => {
      const text = `${u.name} ${u.email} ${u.role}`.toLowerCase();
      const matchesQuery = text.includes(query.toLowerCase());
      const matchesRole = roleFilter === 'All' || u.role === roleFilter;

      return matchesQuery && matchesRole;
    });
  }, [users, query, roleFilter]);

  const roles = ['All', ...new Set(users.map((u) => u.role).filter(Boolean))];

  return (
    <main className="p-5 sm:p-8">
      <Header title="User Management" subtitle="Manage registered buyers and admin accounts." />

      <section className="mb-6 grid gap-4 md:grid-cols-3">
        <SummaryCard label="Total Users" value={users.length} icon={UsersIcon} />
        <SummaryCard label="Active Users" value={users.filter((u) => u.isActive).length} icon={UserCheck} />
        <SummaryCard label="Admins" value={users.filter((u) => u.role === 'admin').length} icon={ShieldCheck} />
      </section>

      <section className="glass mb-6 rounded-[2rem] p-4">
        <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input
              className="input-dark w-full pl-11"
              placeholder="Search users by name, email or role..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <select
            className="input-dark"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            {roles.map((role) => (
              <option key={role}>{role}</option>
            ))}
          </select>
        </div>
      </section>

      <section className="glass overflow-hidden rounded-[2rem]">
        <div className="border-b border-white/10 p-5">
          <h2 className="text-xl font-black text-white">Registered Accounts</h2>
          <p className="mt-1 text-sm text-slate-400">
            Control account status and monitor platform users.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="bg-white/10 text-sm text-slate-300">
              <tr>
                <th className="p-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th className="pr-4 text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400">
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length ? (
                filtered.map((u) => (
                  <tr key={u._id} className="border-t border-white/10 transition hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gold-300/10 font-black text-gold-300">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <p className="font-bold text-white">{u.name}</p>
                      </div>
                    </td>

                    <td className="text-slate-300">{u.email}</td>
                    <td>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-slate-300">
                        {u.role}
                      </span>
                    </td>
                    <td>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          u.isActive
                            ? 'bg-emerald-400/10 text-emerald-300'
                            : 'bg-red-500/10 text-red-300'
                        }`}
                      >
                        {u.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="pr-4 text-right">
                      <button onClick={() => toggle(u)} className="btn-secondary py-2">
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-400">
                    No users match your filters.
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