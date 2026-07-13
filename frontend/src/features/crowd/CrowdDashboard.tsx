import PageHead from '../../components/PageHead';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageContainer } from '../../components/layout/PageContainer'

interface CrowdZone {
  id: number
  name: string
  max_capacity: number
  current_occupancy: number
  density_index: number
}

interface CrowdKPI {
  total_stadium_occupancy: number
  high_density_alerts: number
  active_safe_routes: number
}

interface RouteResult {
  start_zone: number
  end_zone: number
  waypoints: number[]
  is_active: boolean
}

const Skeleton = () => (
  <section aria-label="Loading metrics" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" aria-hidden="true" />)}
  </section>
)

const densityColor = (d: number) =>
  d > 0.8 ? 'bg-red-500' : d > 0.5 ? 'bg-amber-500' : 'bg-emerald-500'

const densityTextColor = (d: number) =>
  d > 0.8 ? 'text-red-400' : d > 0.5 ? 'text-amber-400' : 'text-emerald-400'

const CrowdDashboard: React.FC = () => {
  const [zones, setZones] = useState<CrowdZone[]>([])
  const [kpi, setKpi] = useState<CrowdKPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [routeResult, setRouteResult] = useState<RouteResult | null>(null)
  const [startZone, setStartZone] = useState(1)
  const [endZone, setEndZone] = useState(5)

  useEffect(() => {
    Promise.all([
      axios.get('/api/crowd/zones'),
      axios.get('/api/crowd/dashboard'),
    ]).then(([z, k]) => {
      setZones(Array.isArray(z.data) ? z.data : [])
      setKpi(k.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleRouteRecommend = async () => {
    const r = await axios.post('/api/crowd/routes/recommend', {
      start_zone: startZone, end_zone: endZone, congested_zones: []
    })
    setRouteResult(r.data)
  }

  const avgDensity = zones.length
    ? (zones.reduce((acc, z) => acc + z.density_index, 0) / zones.length)
    : 0

  return (
    <PageContainer>
      <PageHead title="Crowd Intelligence" />
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-purple-400 tracking-tight">Crowd Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time density monitoring · AI-powered safe routing</p>
        </div>
        <span className="badge-info text-xs font-bold px-3 py-1 rounded-full" aria-label="System status: AI-powered">AI-POWERED</span>
      </header>

      {/* KPIs */}
      {loading ? <Skeleton /> : (
        <section aria-label="Crowd Key Performance Indicators" className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800" role="status">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">Total Occupancy</h2>
            <p className="text-3xl font-black text-white">{(kpi?.total_stadium_occupancy ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800" role="status">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">High-Density Alerts</h2>
            <p className="text-3xl font-black text-red-400">{kpi?.high_density_alerts ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800" role="status">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">Active Safe Routes</h2>
            <p className="text-3xl font-black text-emerald-400">{kpi?.active_safe_routes ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800" role="status">
            <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Density</h2>
            <p className={`text-3xl font-black ${densityTextColor(avgDensity)}`}>{Math.round(avgDensity * 100)}%</p>
          </div>
        </section>
      )}

      {/* Zone Density Grid */}
      {/* Zone Density Grid */}
      <section className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6" aria-labelledby="zone-density-title">
        <h2 id="zone-density-title" className="text-lg font-bold text-slate-200 mb-4">Zone Density Map</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-xl" aria-hidden="true" />)}
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <span className="text-4xl" aria-hidden="true">📊</span>
            <p className="mt-2">No zone data available</p>
            <p className="text-xs mt-1">Zones will appear when the database is seeded</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" aria-live="polite">
            {zones.map(zone => (
              <article key={zone.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <h3 className="text-xs font-bold text-slate-400 mb-1">Zone {zone.id}</h3>
                <p className="text-sm font-bold text-white mb-2">{zone.name}</p>
                <p className={`text-2xl font-black ${densityTextColor(zone.density_index)} mb-2`} aria-label={`Density ${Math.round(zone.density_index * 100)}%`}>
                  {Math.round(zone.density_index * 100)}%
                </p>
                <div className="progress-bar mb-1" role="progressbar" aria-label={`Capacity ${zone.id}`} aria-valuenow={Math.round(zone.density_index * 100)} aria-valuemin={0} aria-valuemax={100}>
                  <div className={`progress-bar-fill ${densityColor(zone.density_index)}`}
                    style={{ width: `${Math.round(zone.density_index * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400" aria-label={`Occupancy: ${zone.current_occupancy} out of ${zone.max_capacity}`}>
                  {zone.current_occupancy} / {zone.max_capacity}
                </p>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* AI Route Recommendation */}
      {/* AI Route Recommendation */}
      <section className="bg-slate-900 rounded-xl border border-slate-800 p-5" aria-labelledby="ai-route-title">
        <h2 id="ai-route-title" className="text-lg font-bold text-slate-200 mb-4">AI Safe Route Recommender</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div>
            <label htmlFor="start-zone-input" className="block text-xs text-slate-400 mb-1">Start Zone</label>
            <input id="start-zone-input" type="number" min={1} value={startZone} onChange={e => setStartZone(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-28 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>
          <div>
            <label htmlFor="end-zone-input" className="block text-xs text-slate-400 mb-1">End Zone</label>
            <input id="end-zone-input" type="number" min={1} value={endZone} onChange={e => setEndZone(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-28 focus:ring-2 focus:ring-purple-500 focus:outline-none" />
          </div>
          <button onClick={handleRouteRecommend}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors focus:ring-2 focus:ring-purple-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900">
            Get AI Route
          </button>
        </div>
        {routeResult && (
          <div className="bg-slate-950 border border-purple-800/50 rounded-lg p-4 fade-in" aria-live="polite">
            <p className="text-sm text-slate-200">
              <span className="text-purple-400 font-bold">Route:</span> Zone {routeResult.start_zone}
              {routeResult.waypoints.slice(1, -1).map(w => ` → Z${w}`)} → Zone {routeResult.end_zone}
            </p>
            <p className="text-xs text-slate-400 mt-1">AI-generated safe bypass route · Active: {routeResult.is_active ? 'Yes' : 'No'}</p>
          </div>
        )}
      </section>
    </PageContainer>
  )
}

export default CrowdDashboard


