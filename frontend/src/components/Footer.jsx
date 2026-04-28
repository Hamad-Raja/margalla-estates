import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRight,
  Clock3,
  Mail,
  MapPin,
  Phone,
} from 'lucide-react';

const quickLinks = [
  ['/properties', 'Properties'],
  ['/about', 'About'],
  ['/contact', 'Contact'],
];

const propertyLinks = [
  ['/properties', 'Luxury Homes'],
  ['/properties', 'Apartments'],
  ['/properties', 'Villas'],
  ['/properties', 'Plots'],
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-estate-950/95">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_0.8fr_0.8fr_1fr]">
          
          {/* Brand Section */}
          <div>
            <Link to="/" className="flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-2xl border border-gold-400/40 shadow-lg shadow-gold-400/20">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=400&auto=format&fit=crop"
                  alt="Margalla Estates"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </div>

              <div className="leading-tight">
                <h2 className="text-2xl font-black uppercase tracking-[0.12em] text-[#F4C95D]">
                  Margalla Estates
                </h2>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-300">
                  Islamabad Premium Realty
                </p>
              </div>
            </Link>

            <p className="mt-6 max-w-md text-sm leading-7 text-slate-400 text-justify">
              Margalla Estates is a premium real estate platform helping buyers,
              sellers and investors discover luxury homes, apartments, villas,
              commercial spaces and plots across Islamabad.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#F4C95D]">
              Quick Links
            </h4>

            <div className="grid gap-3">
              {quickLinks.map(([to, label]) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex items-center justify-between rounded-2xl border border-transparent px-1 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/10 hover:bg-white/5 hover:px-4 hover:text-[#F4C95D]"
                >
                  {label}
                  <ArrowUpRight
                    size={15}
                    className="opacity-0 transition group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Property Links */}
          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#F4C95D]">
              Properties
            </h4>

            <div className="grid gap-3">
              {propertyLinks.map(([to, label]) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex items-center justify-between rounded-2xl border border-transparent px-1 py-2 text-sm font-semibold text-slate-400 transition hover:border-white/10 hover:bg-white/5 hover:px-4 hover:text-[#F4C95D]"
                >
                  {label}
                  <ArrowUpRight
                    size={15}
                    className="opacity-0 transition group-hover:opacity-100"
                  />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-5 text-sm font-black uppercase tracking-[0.2em] text-[#F4C95D]">
              Contact
            </h4>

            <div className="grid gap-4 text-sm text-slate-400">
              <p className="flex gap-3 leading-6">
                <MapPin className="mt-1 shrink-0 text-[#F4C95D]" size={18} />
                Blue Area, Islamabad, Pakistan
              </p>

              <p className="flex items-center gap-3">
                <Phone className="shrink-0 text-[#F4C95D]" size={18} />
                +92 300 1234567
              </p>

              <p className="flex items-center gap-3">
                <Mail className="shrink-0 text-[#F4C95D]" size={18} />
                sales@margallaestates.pk
              </p>

              <p className="flex items-center gap-3">
                <Clock3 className="shrink-0 text-[#F4C95D]" size={18} />
                Mon - Sat, 10:00 AM - 7:00 PM
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}