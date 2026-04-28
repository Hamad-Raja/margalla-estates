
import React from 'react';
export default function SectionTitle({eyebrow,title,subtitle,center=false}){return <div className={center?'mx-auto mb-10 max-w-3xl text-center':'mb-10 max-w-3xl'}>{eyebrow&&<p className="mb-3 text-sm font-black uppercase tracking-[0.3em] text-gold-300">{eyebrow}</p>}<h2 className="text-3xl font-black tracking-tight sm:text-5xl">{title}</h2>{subtitle&&<p className="mt-4 text-lg leading-8 text-slate-400">{subtitle}</p>}</div>}
