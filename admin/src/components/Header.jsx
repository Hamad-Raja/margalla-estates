import React from 'react';

export default function Header({ title, subtitle, action }) {
  return (
    <div className="mb-8 flex flex-col justify-between gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20 sm:flex-row sm:items-center">
      <div>
        <div className="mb-3 inline-flex rounded-full border border-gold-400/30 bg-gold-400/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.25em] text-gold-300">
          Admin Control Panel
        </div>

        <h1 className="text-3xl font-black leading-tight text-white sm:text-5xl">
          {title}
        </h1>

        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            {subtitle}
          </p>
        )}
      </div>

      {action && <div>{action}</div>}
    </div>
  );
}