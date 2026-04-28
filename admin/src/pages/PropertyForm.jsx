import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  BadgeCheck,
  Building2,
  Image,
  MapPin,
  Save,
  UserRound,
} from 'lucide-react';
import Header from '../components/Header';
import api from '../services/api';

const empty = {
  title: '',
  overview: '',
  price: '',
  priceLabel: '',
  purpose: 'sale',
  type: 'House',
  status: 'Available',
  sector: 'F-7',
  location: 'F-7, Islamabad',
  address: '',
  bedrooms: 3,
  bathrooms: 3,
  garages: 1,
  area: 10,
  areaUnit: 'Marla',
  yearBuilt: 2024,
  images: '',
  amenities: '',
  highlights: '',
  featured: false,
  premium: false,
  agent: {
    name: 'Margalla Estates Advisor',
    phone: '+92 300 1234567',
    email: 'sales@margallaestates.pk',
    image:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop',
  },
};

export default function PropertyForm() {
  const { id } = useParams();
  const edit = Boolean(id);
  const [form, setForm] = useState(empty);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!edit) return;

    api
      .get(`/properties/${id}`)
      .then(({ data }) =>
        setForm({
          ...data,
          images: data.images?.join('\n') || '',
          amenities: data.amenities?.join('\n') || '',
          highlights: data.highlights?.join('\n') || '',
        })
      )
      .catch(() => toast.error('Failed to load property'));
  }, [edit, id]);

  const set = (name, value) => setForm((f) => ({ ...f, [name]: value }));

  const setAgent = (name, value) =>
    setForm((f) => ({
      ...f,
      agent: {
        ...f.agent,
        [name]: value,
      },
    }));

  async function submit(e) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      ...form,
      price: Number(form.price),
      bedrooms: Number(form.bedrooms),
      bathrooms: Number(form.bathrooms),
      garages: Number(form.garages),
      area: Number(form.area),
      yearBuilt: Number(form.yearBuilt),
      images: String(form.images)
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
      amenities: String(form.amenities)
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
      highlights: String(form.highlights)
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean),
    };

    try {
      edit ? await api.put(`/properties/${id}`, payload) : await api.post('/properties', payload);
      toast.success(edit ? 'Property updated' : 'Property created');
      navigate('/properties');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="p-5 sm:p-8">
      <Header
        title={edit ? 'Edit Property' : 'Add Property'}
        subtitle="Create a premium Islamabad property listing with professional details."
      />

      <form onSubmit={submit} className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="grid gap-6">
          <Panel
            icon={Building2}
            title="Core Property Details"
            subtitle="Basic listing information shown to buyers."
          >
            <div className="grid gap-4 lg:grid-cols-2">
              <Field label="Title" value={form.title} onChange={(v) => set('title', v)} required />
              <Field
                label="Price"
                type="number"
                value={form.price}
                onChange={(v) => set('price', v)}
                required
              />
              <Field
                label="Price Label"
                value={form.priceLabel}
                onChange={(v) => set('priceLabel', v)}
                placeholder="PKR 18.5 Crore"
              />
              <Select
                label="Purpose"
                value={form.purpose}
                onChange={(v) => set('purpose', v)}
                options={['sale', 'rent']}
              />
              <Select
                label="Type"
                value={form.type}
                onChange={(v) => set('type', v)}
                options={['House', 'Apartment', 'Villa', 'Plot', 'Commercial']}
              />
              <Select
                label="Status"
                value={form.status}
                onChange={(v) => set('status', v)}
                options={['Available', 'Booked', 'Sold', 'Rented']}
              />
            </div>
          </Panel>

          <Panel
            icon={MapPin}
            title="Location and Specifications"
            subtitle="Area, sector and property feature information."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <Field label="Sector" value={form.sector} onChange={(v) => set('sector', v)} />
              <Field label="Location" value={form.location} onChange={(v) => set('location', v)} />
              <Field label="Address" value={form.address} onChange={(v) => set('address', v)} />
              <Field
                label="Bedrooms"
                type="number"
                value={form.bedrooms}
                onChange={(v) => set('bedrooms', v)}
              />
              <Field
                label="Bathrooms"
                type="number"
                value={form.bathrooms}
                onChange={(v) => set('bathrooms', v)}
              />
              <Field
                label="Garages"
                type="number"
                value={form.garages}
                onChange={(v) => set('garages', v)}
              />
              <Field label="Area" type="number" value={form.area} onChange={(v) => set('area', v)} />
              <Field label="Area Unit" value={form.areaUnit} onChange={(v) => set('areaUnit', v)} />
              <Field
                label="Year Built"
                type="number"
                value={form.yearBuilt}
                onChange={(v) => set('yearBuilt', v)}
              />
            </div>
          </Panel>

          <Panel
            icon={BadgeCheck}
            title="Marketing Content"
            subtitle="Write strong content for buyers and investors."
          >
            <Textarea
              label="Overview"
              value={form.overview}
              onChange={(v) => set('overview', v)}
              required
            />
            <Textarea
              label="Amenities, one per line"
              value={form.amenities}
              onChange={(v) => set('amenities', v)}
            />
            <Textarea
              label="Highlights, one per line"
              value={form.highlights}
              onChange={(v) => set('highlights', v)}
            />
          </Panel>

          <Panel
            icon={Image}
            title="Property Images"
            subtitle="Paste high-quality image URLs, one URL per line."
          >
            <Textarea
              label="Image URLs, one per line"
              value={form.images}
              onChange={(v) => set('images', v)}
              required
            />
          </Panel>

          <Panel
            icon={UserRound}
            title="Agent Information"
            subtitle="Contact details shown with the property listing."
          >
            <div className="grid gap-4 lg:grid-cols-3">
              <Field
                label="Agent Name"
                value={form.agent?.name}
                onChange={(v) => setAgent('name', v)}
              />
              <Field
                label="Agent Phone"
                value={form.agent?.phone}
                onChange={(v) => setAgent('phone', v)}
              />
              <Field
                label="Agent Email"
                value={form.agent?.email}
                onChange={(v) => setAgent('email', v)}
              />
            </div>
          </Panel>
        </section>

        <aside className="xl:sticky xl:top-6 xl:h-max">
          <div className="glass rounded-[2rem] p-6">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-gold-300">
              Listing Control
            </p>

            <h2 className="mt-3 text-2xl font-black text-white">
              {edit ? 'Update Listing' : 'Publish Listing'}
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Review your property information before saving. Featured and premium listings can be highlighted across the website.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <span>
                  <b className="block text-white">Featured</b>
                  <small className="text-slate-400">Show in featured sections</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => set('featured', e.target.checked)}
                />
              </label>

              <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
                <span>
                  <b className="block text-white">Premium</b>
                  <small className="text-slate-400">Mark as premium listing</small>
                </span>
                <input
                  type="checkbox"
                  checked={form.premium}
                  onChange={(e) => set('premium', e.target.checked)}
                />
              </label>
            </div>

            <button className="btn-primary mt-6 flex w-full items-center justify-center gap-2" disabled={saving}>
              <Save size={18} />
              {saving ? 'Saving...' : 'Save Property'}
            </button>

            <button
              type="button"
              className="btn-secondary mt-3 w-full"
              onClick={() => navigate('/properties')}
            >
              Cancel
            </button>
          </div>
        </aside>
      </form>
    </main>
  );
}

function Panel({ icon: Icon, title, subtitle, children }) {
  return (
    <section className="glass rounded-[2rem] p-6">
      <div className="mb-5 flex items-start gap-4">
        <div className="rounded-2xl bg-gold-300/10 p-3 text-gold-300">
          <Icon size={22} />
        </div>
        <div>
          <h2 className="text-xl font-black text-white">{title}</h2>
          <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      {children}
    </section>
  );
}

function Field({ label, value, onChange, type = 'text', ...props }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-300">
      {label}
      <input
        className="input-dark"
        type={type}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, ...props }) {
  return (
    <label className="mt-4 grid gap-2 text-sm font-bold text-slate-300 first:mt-0">
      {label}
      <textarea
        className="input-dark min-h-36 resize-y"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </label>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <label className="grid gap-2 text-sm font-bold text-slate-300">
      {label}
      <select className="input-dark" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}