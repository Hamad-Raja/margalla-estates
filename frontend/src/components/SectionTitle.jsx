
import React from 'react';
export default function SectionTitle({eyebrow,title,subtitle,center=false}){return <div className={center?'mx-auto mb-10 max-w-3xl text-center':'mb-10 max-w-3xl'}>{eyebrow&&<p className="type-eyebrow mb-3">{eyebrow}</p>}<h2 className="type-section-title">{title}</h2>{subtitle&&<p className="type-body-lg mt-4 text-slate-400">{subtitle}</p>}</div>}
