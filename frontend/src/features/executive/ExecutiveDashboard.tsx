import React, { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { PageContainer } from '../../components/layout/PageContainer';
import PageHead from '../../components/PageHead';

interface ExecutiveData {
  platform_status: string;
  active_incidents: number;
  total_attendance: number;
  eco_score_percentage: number | null;
  volunteer_utilization: number | null;
  crowd_density_index: number | null;
  open_accessibility_requests: number;
  active_shuttle_routes: number;
  services_health: { service_name: string; status: string }[];
}

interface AnalyticsData {
  attendance_trend: number[];
  crowd_density: number[];
  incident_timeline: number[];
  revenue: number[];
  volunteer_activity: number[];
  transport_load: number[];
  energy_consumption: number[];
  medical_requests: number[];
}

interface SummaryData {
  executive_summary: string | null;
  current_risks: string[];
  predictions: string[];
  recommended_actions: string[];
  priority: string | null;
  confidence: number | null;
  business_impact: string | null;
  estimated_resolution_time: string | null;
}

interface KpiData {
  revenue: number | null;
  fan_satisfaction: number | null;
  medical_readiness: string | null;
  emergency_readiness: string | null;
  security_readiness: string | null;
  ai_confidence: number | null;
}

interface Decision {
  id: number;
  source_ai_domain: string;
  action_code: string;
  priority_level: string;
  confidence_score: number;
  trigger_event: string;
  execution_status: string;
  timestamp: string;
}

const KpiCard = ({ label, value, trend, prefix = '', suffix = '', emptyState = '—' }: { label: string; value: any; trend?: 'up' | 'down' | 'neutral'; prefix?: string; suffix?: string; emptyState?: string }) => {
  const isNull = value === null || value === undefined;
  return (
    <div className="bg-slate-900/50 backdrop-blur-md p-5 rounded-2xl border border-slate-800/60 hover:border-slate-700/80 transition-all flex flex-col justify-between group">
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-semibold text-slate-400 tracking-wide uppercase">{label}</span>
        {!isNull && trend === 'up' && <span className="text-emerald-400 text-xs">▲</span>}
        {!isNull && trend === 'down' && <span className="text-red-400 text-xs">▼</span>}
      </div>
      <div className="text-3xl font-black text-white group-hover:scale-105 transition-transform origin-left">
        {isNull ? <span className="text-slate-600 font-medium text-2xl">{emptyState}</span> : `${prefix}${value}${suffix}`}
      </div>
    </div>
  );
};

const Sparkline = ({ data, colorClass = "bg-cyan-500" }: { data: number[], colorClass?: string }) => {
  if (!data || data.length === 0) return <div className="h-12 flex items-center justify-center text-xs text-slate-600">No Data</div>;
  const max = Math.max(...data, 1);
  return (
    <div className="flex items-end h-12 gap-1 mt-2">
      {data.map((val, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${(val / max) * 100}%` }}
          className={`flex-1 rounded-t-sm opacity-80 ${colorClass}`}
        />
      ))}
    </div>
  );
}

const ExecutiveDashboard: React.FC = () => {
  const { translate } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ExecutiveData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [summary, setSummary] = useState<SummaryData | null>(null);
  const [kpis, setKpis] = useState<KpiData | null>(null);
  const [decisions, setDecisions] = useState<Decision[]>([]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [dashRes, kpiRes, anaRes, sumRes, decRes] = await Promise.all([
        axios.get('/api/executive/dashboard'),
        axios.get('/api/executive/kpis'),
        axios.get('/api/executive/analytics'),
        axios.get('/api/executive/summary'),
        axios.get('/api/orchestrator/decisions')
      ]);
      setData(dashRes.data);
      setKpis(kpiRes.data);
      setAnalytics(anaRes.data);
      setSummary(sumRes.data);
      setDecisions(Array.isArray(decRes.data) ? decRes.data : []);
    } catch (e: any) {
      console.error(e);
      setError(e.message || "Failed to fetch executive data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const healthScore = useMemo(() => {
    if (!data) return 0;
    const healthyServices = Array.isArray(data.services_health) ? data.services_health.filter(s => s.status === 'HEALTHY').length : 0;
    const totalServices = Array.isArray(data.services_health) ? data.services_health.length : 1;
    return Math.round((healthyServices / Math.max(totalServices, 1)) * 100);
  }, [data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center">
        <PageHead title="Executive Command Center" />
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 font-medium">Initializing Executive Command...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-50 flex items-center justify-center p-6">
        <PageHead title="Executive Command Center" />
        <div className="max-w-md bg-slate-900 border border-red-500/30 rounded-xl p-8 text-center space-y-4">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-100">Connection Interrupted</h2>
          <p className="text-slate-400 text-sm">{error || "Unable to connect."}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-6 px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium border border-slate-700"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageContainer>
      <PageHead title="Executive Command Center" />
      
      {/* PHASE 2: Executive Hero */}
      <header className="mb-8 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-950 rounded-3xl p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl pointer-events-none">
          <div className="w-64 h-64 bg-cyan-500 rounded-full" />
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2.5 py-1 text-xs font-black rounded-full border tracking-widest ${data.platform_status === 'HEALTHY' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                ● {translate(data.platform_status)}
              </span>
              <span className="text-slate-500 text-sm font-medium">| {translate("C-Suite Command Center")}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
              {translate("Executive Insights")}
            </h1>
          </div>
          <div className="flex gap-4">
            <div className="text-right">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{translate("AI Health Score")}</div>
              <div className="text-3xl font-black text-cyan-400">{healthScore}%</div>
            </div>
            <div className="text-right">
              <div className="text-slate-400 text-xs font-bold uppercase tracking-wider">{translate("Active Risk")}</div>
              <div className="text-3xl font-black text-amber-400">{summary?.priority ? translate(summary.priority) : translate("NONE")}</div>
            </div>
          </div>
        </div>
      </header>

      {/* PHASE 3: Executive KPI Cards */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <KpiCard label={translate("Total Attendance")} value={data.total_attendance.toLocaleString()} trend="up" />
        <KpiCard label={translate("Crowd Density")} value={data.crowd_density_index ? Math.round(data.crowd_density_index * 100) : null} suffix="%" trend={data.crowd_density_index && data.crowd_density_index > 0.8 ? 'down' : 'neutral'} />
        <KpiCard label={translate("Active Incidents")} value={data.active_incidents} trend="down" />
        <KpiCard label={translate("Eco-Score")} value={data.eco_score_percentage ? Math.round(data.eco_score_percentage) : null} suffix="%" trend="neutral" />
        <KpiCard label={translate("Vol. Utilization")} value={data.volunteer_utilization ? Math.round(data.volunteer_utilization * 100) : null} suffix="%" trend="up" />
        <KpiCard label={translate("Revenue")} value={kpis?.revenue} prefix="$" trend="neutral" emptyState={translate("Data Unavailable")} />
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* PHASE 4: Executive AI Insights */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/60 p-6 flex flex-col relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500" />
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-indigo-400">✨</span> {translate("AI Executive Summary")}
          </h2>
          {summary?.executive_summary ? (
            <>
              <p className="text-xl text-slate-300 leading-relaxed font-medium mb-6">
                {summary.executive_summary}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">{translate("Confidence")}</div>
                  <div className="text-lg font-bold text-emerald-400">{summary.confidence ? Math.round(summary.confidence * 100) + '%' : '—'}</div>
                </div>
                <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/50">
                  <div className="text-xs text-slate-500 uppercase font-bold mb-1">{translate("Business Impact")}</div>
                  <div className="text-lg font-bold text-amber-400">{summary.business_impact ? translate(summary.business_impact) : '—'}</div>
                </div>
              </div>
            </>
          ) : (
             <div className="flex-1 flex items-center justify-center text-slate-500 italic p-6 text-center border border-dashed border-slate-700/50 rounded-xl bg-slate-900/20">
               {translate("AI Summary currently unavailable. Awaiting sufficient domain telemetry.")}
             </div>
          )}
        </div>

        {/* Live Operational Map / Analytics Stub */}
        <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/60 p-6">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wide mb-4">{translate("Live Venue Telemetry")}</h2>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                <span>{translate("Crowd Density Trend")}</span>
                <span>{analytics?.crowd_density?.length ? translate('LIVE') : translate('OFFLINE')}</span>
              </div>
              <Sparkline data={analytics?.crowd_density || []} colorClass="bg-indigo-500" />
            </div>
            <div className="pt-4 border-t border-slate-800/50">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">{translate("Open ADA Requests")}</span>
                <span className="font-bold text-white">{data.open_accessibility_requests}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-300">{translate("Active Shuttle Routes")}</span>
                <span className="font-bold text-white">{data.active_shuttle_routes}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* PHASE 7: Decision Center */}
      <section className="bg-slate-900/50 backdrop-blur-md rounded-3xl border border-slate-800/60 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-bold text-white">{translate("Unified AI Decision Arbitration")}</h2>
          <span className="text-xs bg-slate-800 text-slate-300 px-3 py-1 rounded-full">{translate("Last 10 Decisions")}</span>
        </div>
        
        {decisions.length === 0 ? (
          <div className="py-12 text-center text-slate-500 border border-dashed border-slate-700/50 rounded-xl bg-slate-900/20">
            {translate("No recent AI arbitration decisions.")}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-slate-800 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="pb-3 pr-4">{translate("Domain")}</th>
                  <th className="pb-3 pr-4">{translate("Priority")}</th>
                  <th className="pb-3 pr-4">{translate("Action")}</th>
                  <th className="pb-3 pr-4">{translate("Confidence")}</th>
                  <th className="pb-3">{translate("Status")}</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <AnimatePresence>
                  {decisions.map((d) => (
                    <motion.tr 
                      key={d.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors"
                    >
                      <td className="py-4 pr-4">
                        <span className="px-2 py-1 bg-slate-800 text-slate-300 rounded text-xs font-mono">{translate(d.source_ai_domain)}</span>
                      </td>
                      <td className="py-4 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-bold tracking-widest ${
                          d.priority_level === 'CRITICAL' ? 'bg-red-500/20 text-red-400' :
                          d.priority_level === 'HIGH' ? 'bg-amber-500/20 text-amber-400' :
                          'bg-emerald-500/20 text-emerald-400'
                        }`}>{translate(d.priority_level)}</span>
                      </td>
                      <td className="py-4 pr-4 text-white font-medium">{d.action_code}</td>
                      <td className="py-4 pr-4 text-slate-400">{Math.round(d.confidence_score * 100)}%</td>
                      <td className="py-4">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                          {translate(d.execution_status)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </section>

    </PageContainer>
  );
};

export default ExecutiveDashboard;

