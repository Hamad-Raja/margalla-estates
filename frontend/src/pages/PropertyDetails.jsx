import React from 'react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Bath, BedDouble, ChevronLeft, MapPin, Maximize2, ShieldCheck } from 'lucide-react';
import api from '../services/api';
import { fallbackProperties } from '../data/fallbackProperties';
import { formatPKR } from '../utils/format';
import BookingForm from '../components/BookingForm';

export default function PropertyDetails(){
  const {slug}=useParams();const [property,setProperty]=useState(null);const [active,setActive]=useState(0);
  useEffect(()=>{api.get(`/properties/${slug}`).then(({data})=>setProperty(data)).catch(()=>setProperty(fallbackProperties.find(p=>p.slug===slug||p._id===slug)||fallbackProperties[0]))},[slug]);
  if(!property) return <main className="min-h-screen pt-32 text-center">Loading property...</main>;
  const images=property.images?.length?property.images:[fallbackProperties[0].images[0]];
  return <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
    <Link to="/properties" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-300"><ChevronLeft size={16}/> Back to listings</Link>
    <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
      <section><div className="overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.05]"><img src={images[active]} alt={property.title} className="h-[520px] w-full object-cover"/></div><div className="mt-4 grid grid-cols-4 gap-3">{images.map((img,i)=><button key={img} onClick={()=>setActive(i)} className={`h-24 overflow-hidden rounded-2xl border ${active===i?'border-gold-400':'border-white/10'}`}><img src={img} alt="Property preview" className="h-full w-full object-cover"/></button>)}</div>
        <div className="mt-10"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-gold-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-estate-950">{property.purpose}</span><span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{property.type}</span></div><h1 className="type-page-title mt-5 max-w-4xl">{property.title}</h1><p className="mt-4 flex items-center gap-2 leading-7 text-slate-400"><MapPin size={18}/> {property.address||property.location}</p><p className="mt-6 text-3xl font-semibold leading-tight text-gold-300 sm:text-4xl">{property.priceLabel||formatPKR(property.price)}</p>
        <div className="mt-8 grid gap-3 sm:grid-cols-4"><Stat icon={<BedDouble/>} label="Bedrooms" value={property.bedrooms}/><Stat icon={<Bath/>} label="Bathrooms" value={property.bathrooms}/><Stat icon={<Maximize2/>} label="Area" value={`${property.area} ${property.areaUnit}`}/><Stat icon={<ShieldCheck/>} label="Status" value={property.status}/></div>
        <div className="mt-10 glass rounded-[2rem] p-8"><h2 className="type-card-title">Property Overview</h2><p className="type-body mt-4 text-slate-300">{property.overview}</p></div><div className="mt-6 grid gap-6 lg:grid-cols-2"><Info title="Amenities" items={property.amenities||[]}/><Info title="Highlights" items={property.highlights||[]}/></div></div>
      </section>
      <aside className="space-y-6 lg:sticky lg:top-28 lg:h-fit"><BookingForm property={property}/><div className="glass rounded-[2rem] p-6"><h3 className="type-card-title">Assigned Advisor</h3><div className="mt-5 flex items-center gap-4"><img src={property.agent?.image||'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=600&auto=format&fit=crop'} className="h-16 w-16 rounded-2xl object-cover"/><div><p className="font-semibold">{property.agent?.name||'Margalla Advisor'}</p><p className="text-sm text-slate-400">{property.agent?.phone}</p><p className="text-sm text-slate-400">{property.agent?.email}</p></div></div></div></aside>
    </div>
  </main>
}
function Stat({icon,label,value}){return <div className="rounded-3xl border border-white/10 bg-white/[0.05] p-5"><div className="mb-3 text-gold-300">{icon}</div><p className="text-sm text-slate-400">{label}</p><p className="mt-1 text-lg font-semibold leading-snug">{value}</p></div>}
function Info({title,items}){return <div className="glass rounded-[2rem] p-6"><h3 className="type-card-title">{title}</h3><div className="mt-4 grid gap-3">{items.map(item=><p key={item} className="flex items-center gap-3 text-slate-300"><span className="h-2 w-2 rounded-full bg-gold-300"/>{item}</p>)}</div></div>}
