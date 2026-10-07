import React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Search } from 'lucide-react';
import api from '../services/api';
import { fallbackProperties } from '../data/fallbackProperties';
import PropertyCard from '../components/PropertyCard';

const sectors=['All','F-7','F-8','DHA Phase 2','Bahria Enclave','Gulberg Greens','D-12','E-11'];
const types=['All','House','Apartment','Villa','Plot','Commercial'];

export default function Properties(){
  const [searchParams]=useSearchParams();
  const [properties,setProperties]=useState(fallbackProperties);
  const [loading,setLoading]=useState(false);
  const [filters,setFilters]=useState({search:'',sector:searchParams.get('sector')||'All',type:'All',purpose:'All',bedrooms:'All',sort:'newest'});
  const query=useMemo(()=>Object.fromEntries(Object.entries(filters).filter(([,v])=>v&&v!=='All')),[filters]);
  useEffect(()=>{setLoading(true);api.get('/properties',{params:{...query,limit:60}}).then(({data})=>setProperties(data.items||[])).catch(()=>setProperties(fallbackProperties)).finally(()=>setLoading(false))},[query]);
  const set=(name,value)=>setFilters(f=>({...f,[name]:value}));
  return <main className="mx-auto min-h-screen max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8">
    <div className="mb-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end"><div><p className="type-eyebrow">Listings</p><h1 className="type-page-title mt-3">Islamabad Properties</h1><p className="type-body mt-4 text-slate-400">Filter homes, villas, apartments and plots in PKR.</p></div><div className="glass flex items-center gap-3 rounded-2xl px-4 py-3"><Search size={18} className="text-slate-400"/><input value={filters.search} onChange={e=>set('search',e.target.value)} placeholder="Search sector, house, plot..." className="w-full bg-transparent text-[15px] outline-none placeholder:text-slate-500 lg:w-80"/></div></div>
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="glass h-fit rounded-[2rem] p-6"><div className="mb-6 flex items-center gap-2"><Filter className="text-gold-300"/><h2 className="type-card-title">Filters</h2></div><div className="grid gap-5"><Select label="Sector" value={filters.sector} onChange={v=>set('sector',v)} items={sectors}/><Select label="Type" value={filters.type} onChange={v=>set('type',v)} items={types}/><Select label="Purpose" value={filters.purpose} onChange={v=>set('purpose',v)} items={['All','sale','rent']}/><Select label="Bedrooms" value={filters.bedrooms} onChange={v=>set('bedrooms',v)} items={['All','1','2','3','4','5','6']}/><Select label="Sort" value={filters.sort} onChange={v=>set('sort',v)} items={['newest','priceLow','priceHigh','areaHigh','popular']}/><button onClick={()=>setFilters({search:'',sector:'All',type:'All',purpose:'All',bedrooms:'All',sort:'newest'})} className="btn-secondary">Reset Filters</button></div></aside>
      <section><div className="mb-5 text-sm text-slate-400">{loading?'Loading listings...':`${properties.length} properties found`}</div><div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">{properties.map(p=><PropertyCard key={p._id} property={p}/>)}</div>{!properties.length&&<div className="glass rounded-[2rem] p-10 text-center text-slate-400">No properties matched your filters.</div>}</section>
    </div>
  </main>
}
function Select({label,value,onChange,items}){return <label className="grid gap-2 text-sm font-semibold text-slate-300">{label}<select className="input-dark" value={value} onChange={e=>onChange(e.target.value)}>{items.map(x=><option key={x}>{x}</option>)}</select></label>}
