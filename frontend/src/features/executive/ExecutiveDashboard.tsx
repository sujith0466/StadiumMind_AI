import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface ExecutiveDashboardData {
  platform_status: string;
  active_incidents: number;
  total_attendance: number;
  eco_score_percentage: number;
  volunteer_utilization: number;
  services_health: { service_name: string; status: string }[];
}

const ExecutiveDashboard: React.FC = () => {
  const [data, setData] = useState<ExecutiveDashboardData | null>(null);

  useEffect(() => {
    axios.get('/api/executive/dashboard')
      .then(res => setData(res.data))
      .catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-slate-950 text-white min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-amber-400 tracking-tight">C-Suite Executive Command</h1>
          <p className="text-sm text-slate-400">Unified AI Orchestration, Cross-Module Intelligence & Platform Oversight</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 text-xs px-3 py-1 rounded-full font-bold">
            PLATFORM: {data?.platform_status || 'HEALTHY'}
          </span>
        </div>
      </div>

      {/* Top-level C-Suite KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Attendance</h2>
          <p className="text-3xl font-black text-white mt-1">{data?.total_attendance?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Incidents</h2>
          <p className="text-3xl font-black text-red-400 mt-1">{data?.active_incidents || 0}</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eco-Score Metric</h2>
          <p className="text-3xl font-black text-emerald-400 mt-1">{data?.eco_score_percentage || 0}%</p>
        </div>
        <div className="bg-slate-900 p-5 rounded-lg border border-slate-800 shadow">
          <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Volunteer Utilization</h2>
          <p className="text-3xl font-black text-cyan-400 mt-1">{((data?.volunteer_utilization || 0) * 100).toFixed(0)}%</p>
        </div>
      </div>

      {/* Unified AI Decision Arbitration Log & Platform Health */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow col-span-2">
          <h2 className="text-lg font-bold text-amber-400 mb-4">Unified AI Decision Arbitration Feed</h2>
          <div className="bg-slate-950 p-4 rounded border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs text-slate-400 font-mono">
              <span>[EMERGENCY AI OVERRIDE]</span>
              <span className="text-emerald-400 font-bold">EXECUTED</span>
            </div>
            <p className="text-sm font-bold text-white">Action: EVACUATE_ZONE_4 (Priority: EMERGENCY)</p>
            <p className="text-xs text-slate-400">
              Confidence: 99% | Supporting: Crowd AI, Transport AI | Trigger: CODE RED - Medical Alert in Sector 4
            </p>
          </div>
        </div>

        <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 shadow">
          <h2 className="text-lg font-bold text-amber-400 mb-4">Service Health Matrix</h2>
          <div className="space-y-3">
            {data?.services_health.map((s, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm bg-slate-950 px-3 py-2 rounded border border-slate-800">
                <span className="text-slate-300 font-medium">{s.service_name}</span>
                <span className="text-emerald-400 text-xs font-bold">{s.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveDashboard;
