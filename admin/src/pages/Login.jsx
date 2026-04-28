import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
import api from '../services/api';

export default function Login() {
  const [form, setForm] = useState({
    email: 'admin@margallaestates.pk',
    password: 'Admin@12345',
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await api.post('/auth/admin-login', form);

      localStorage.setItem('margalla_admin_token', data.token);
      localStorage.setItem('margalla_admin_user', JSON.stringify(data.user));

      toast.success('Admin login successful');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4 py-10">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 shadow-glow lg:grid-cols-2">
        <div className="hidden bg-gradient-to-br from-gold-300/20 via-white/5 to-transparent p-10 lg:block">
          <div className="flex h-full flex-col justify-between">
            <div>
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-300/20 text-gold-300">
                <ShieldCheck size={28} />
              </div>

              <h1 className="mt-8 text-5xl font-black leading-tight text-white">
                Margalla Estates Admin Portal
              </h1>

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-300">
                Secure dashboard access for managing premium Islamabad listings, buyer inquiries,
                appointments and platform users.
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-black/20 p-5">
              <p className="text-sm font-bold text-gold-300">Protected Access</p>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Only authorized administrators can access listing management, inquiries and user controls.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="glass rounded-none p-8 sm:p-10">
          <div className="mx-auto max-w-md">
            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gold-300/10 text-gold-300">
              <LockKeyhole size={26} />
            </div>

            <p className="mt-8 text-sm font-black uppercase tracking-[0.3em] text-gold-300">
              Secure Access
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">Admin Login</h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Use seeded admin credentials or your custom environment admin account.
            </p>

            <div className="mt-8 grid gap-4">
              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Email Address
                <input
                  className="input-dark"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@example.com"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm font-bold text-slate-300">
                Password
                <input
                  className="input-dark"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Enter password"
                  required
                />
              </label>

              <button className="btn-primary mt-2" disabled={loading}>
                {loading ? 'Signing in...' : 'Login to Dashboard'}
              </button>
            </div>

            <p className="mt-6 text-center text-xs text-slate-500">
              Margalla Estates admin system · Private and secure
            </p>
          </div>
        </form>
      </section>
    </main>
  );
}