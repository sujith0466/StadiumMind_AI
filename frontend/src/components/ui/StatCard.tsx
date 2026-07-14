import React from 'react';

export interface StatCardProps {
  title: string;
  value: React.ReactNode;
  valueColorClass?: string;
}

export function StatCard({ title, value, valueColorClass = "text-white" }: StatCardProps) {
  return (
    <div className="bg-slate-900 p-5 rounded-xl border border-slate-800" role="status">
      <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">{title}</h2>
      <p className={`text-3xl font-black ${valueColorClass}`}>{value}</p>
    </div>
  );
}
