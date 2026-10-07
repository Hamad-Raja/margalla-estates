import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Building2, CheckCircle2, Home as HomeIcon, ShieldCheck, Sparkles, TrendingUp } from 'lucide-react';
import api from '../services/api';
import { fallbackProperties } from '../data/fallbackProperties';
import PropertyCard from '../components/PropertyCard';
import SectionTitle from '../components/SectionTitle';

const stats = [
  ['PKR 85B+', 'Managed portfolio'],
  ['450+', 'Islamabad properties'],
  ['18+', 'Premium sectors'],
  ['4.9/5', 'Client rating']
];

const areas = ['F-7', 'F-8', 'DHA Phase 2', 'Bahria Enclave', 'Gulberg Greens', 'D-12', 'E-11', 'Blue Area'];

export default function Home() {
  const [properties, setProperties] = useState(fallbackProperties);

  useEffect(() => {
    api
      .get('/properties', { params: { featured: true, limit: 9, sort: 'popular' } })
      .then(({ data }) => {
        if (data?.items?.length) setProperties(data.items);
      })
      .catch(() => { });
  }, []);

  return (
    <main>
      <section className="relative min-h-screen overflow-hidden pt-28">
        <div className="absolute inset-0">
          <img
            className="h-full w-full object-cover opacity-30"
            src="https://images.unsplash.com/photo-1597212720419-32cc9d7cb0af?q=80&w=1800&auto=format&fit=crop"
            alt="Islamabad skyline"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-estate-950/80 via-estate-950/90 to-estate-950" />
        </div>

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-300">
              <Sparkles size={16} /> Premium Islamabad Real Estate
            </span>
            <h1 className="type-hero mt-7 max-w-3xl">
              Find your next luxury home in Islamabad.
            </h1>
            <p className="type-body-lg mt-5 max-w-[42rem] text-slate-300">
              Explore curated houses, villas, apartments and investment plots across Islamabad’s most valuable sectors with trusted advisors and verified listings.
            </p>
            <div className="mt-8 flex flex-col gap-4 min-[440px]:flex-row min-[440px]:flex-wrap">
              <Link className="btn-primary inline-flex items-center gap-2" to="/properties">
                Explore Properties <ArrowRight size={18} />
              </Link>
              <Link className="btn-secondary" to="/contact">
                Talk to Advisor
              </Link>
            </div>
            <div className="mt-12 grid max-w-2xl grid-cols-1 gap-4 min-[480px]:grid-cols-2 sm:grid-cols-4">
              {stats.map(([value, label]) => (
                <div key={label} className="glass rounded-3xl p-4">
                  <p className="stat-value">{value}</p>
                  <p className="text-xs text-slate-400">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="relative hidden lg:block">
            <div className="rounded-[3rem] border border-white/10 bg-white/10 p-4 shadow-glow backdrop-blur-xl">
              <img
                className="h-[600px] w-full rounded-[2.5rem] object-cover"
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop"
                alt="Luxury Islamabad house"
              />
            </div>
            <div className="absolute -bottom-8 -left-8 glass rounded-[2rem] p-5 shadow-glow">
              <p className="text-sm text-slate-300">Featured sector</p>
              <p className="text-2xl font-semibold leading-tight text-gold-300">F-7 Islamabad</p>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Featured Collection"
          title="Curated Islamabad properties"
          subtitle="Hand-picked homes and investment assets from premium sectors."
        />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 9).map((property) => (
            <PropertyCard key={property._id || property.slug} property={property} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            [ShieldCheck, 'Verified Listings', 'Every property is reviewed for price, location, availability and documentation guidance.'],
            [TrendingUp, 'Investment Insights', 'Compare sectors by demand, rental potential, access routes and resale value.'],
            [HomeIcon, 'Private Viewings', 'Book secure in-person or virtual property visits with our advisory team.']
          ].map(([Icon, title, text]) => (
            <div className="glass card-hover rounded-[2rem] p-8" key={title}>
              <Icon className="mb-6 text-gold-300" size={34} />
              <h3 className="type-card-title">{title}</h3>
              <p className="type-body mt-3 text-slate-400">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,201,93,0.12),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(16,185,129,0.10),transparent_35%)]"></div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="mb-4 inline-flex rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-2 text-sm font-semibold text-gold-300">
                Premium Islamabad Locations
              </span>

              <h2 className="type-section-title max-w-2xl text-white">
                Search by premium area
              </h2>

              <p className="type-body-lg mt-4 max-w-2xl text-slate-400">
                From Margalla-facing sectors to secure gated communities, explore verified
                homes, villas, apartments, plots, and commercial spaces in Islamabad’s most
                demanded locations.
              </p>
            </div>

            <Link
              to="/properties"
              className="w-fit rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold tracking-[0.01em] text-white transition hover:border-gold-400/40 hover:bg-gold-400 hover:text-estate-950"
            >
              View All Locations
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                name: 'F-7',
                count: '10+ Properties',
                tag: 'Luxury Sector',
                image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'F-8',
                count: '10+ Properties',
                tag: 'Central Islamabad',
                image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'DHA Phase 2',
                count: '10+ Properties',
                tag: 'Gated Community',
                image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'Bahria Enclave',
                count: '10+ Properties',
                tag: 'Secure Living',
                image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'Gulberg Greens',
                count: '10+ Properties',
                tag: 'Farmhouse Zone',
                image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'D-12',
                count: '10+ Properties',
                tag: 'Margalla View',
                image: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'E-11',
                count: '10+ Properties',
                tag: 'Apartments Hub',
                image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=900&auto=format&fit=crop'
              },
              {
                name: 'Blue Area',
                count: '10+ Properties',
                tag: 'Commercial Core',
                image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=900&auto=format&fit=crop'
              }
            ].map((location) => (
              <Link
                key={location.name}
                to={`/properties?sector=${encodeURIComponent(location.name)}`}
                className="group relative min-h-[260px] overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-xl shadow-black/20 transition duration-300 hover:-translate-y-2 hover:border-gold-400/50 hover:shadow-gold-400/10"
              >
                <img
                  src={location.image}
                  alt={location.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-estate-950 via-estate-950/55 to-transparent"></div>

                <div className="absolute left-5 top-5 rounded-full border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white backdrop-blur-md">
                  {location.tag}
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gold-400 text-xl font-semibold text-estate-950 shadow-lg shadow-gold-400/20">
                    {location.name.slice(0, 1)}
                  </div>

                  <h3 className="text-3xl font-semibold leading-tight text-white">
                    {location.name}
                  </h3>

                  <p className="mt-2 text-sm font-semibold text-gold-300">
                    {location.count}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-slate-300">
                      Explore listings
                    </span>

                    <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white transition group-hover:bg-gold-400 group-hover:text-estate-950">
                      →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[3rem] border border-white/10 bg-gradient-to-br from-estate-800 to-estate-950 p-8 lg:p-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <Building2 className="mb-6 text-gold-300" size={42} />
              <h2 className="type-section-title max-w-2xl">Ready to list or buy in Islamabad?</h2>
              <p className="type-body mt-4 max-w-2xl text-slate-300">
                Share your budget, preferred sector and property type. Our team will shortlist the best options in PKR within your target area.
              </p>
            </div>
            <Link to="/contact" className="btn-primary inline-flex items-center justify-center gap-2">
              Get Consultation <CheckCircle2 size={18} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
