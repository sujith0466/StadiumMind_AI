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
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
    {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
  </div>
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
      setZones(z.data)
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
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-purple-400 tracking-tight">Crowd Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time density monitoring · AI-powered safe routing</p>
        </div>
        <span className="badge-info text-xs font-bold px-3 py-1 rounded-full">AI-POWERED</span>
      </div>

      {/* KPIs */}
      {loading ? <Skeleton /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Occupancy</p>
            <p className="text-3xl font-black text-white">{(kpi?.total_stadium_occupancy ?? 0).toLocaleString()}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">High-Density Alerts</p>
            <p className="text-3xl font-black text-red-400">{kpi?.high_density_alerts ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Safe Routes</p>
            <p className="text-3xl font-black text-emerald-400">{kpi?.active_safe_routes ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Avg Density</p>
            <p className={`text-3xl font-black ${densityTextColor(avgDensity)}`}>{Math.round(avgDensity * 100)}%</p>
          </div>
        </div>
      )}

      {/* Zone Density Grid */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 mb-6">
        <h2 className="text-lg font-bold text-slate-200 mb-4">Zone Density Map</h2>
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-32 rounded-xl" />)}
          </div>
        ) : zones.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <span className="text-4xl">📊</span>
            <p className="mt-2">No zone data available</p>
            <p className="text-xs mt-1">Zones will appear when the database is seeded</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {zones.map(zone => (
              <div key={zone.id} className="bg-slate-950 p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors">
                <p className="text-xs font-bold text-slate-400 mb-1">Zone {zone.id}</p>
                <p className="text-sm font-bold text-white mb-2">{zone.name}</p>
                <p className={`text-2xl font-black ${densityTextColor(zone.density_index)} mb-2`}>
                  {Math.round(zone.density_index * 100)}%
                </p>
                <div className="progress-bar mb-1">
                  <div className={`progress-bar-fill ${densityColor(zone.density_index)}`}
                    style={{ width: `${Math.round(zone.density_index * 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-500">{zone.current_occupancy} / {zone.max_capacity}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Route Recommendation */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
        <h2 className="text-lg font-bold text-slate-200 mb-4">AI Safe Route Recommender</h2>
        <div className="flex flex-wrap gap-3 items-end mb-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1">Start Zone</label>
            <input type="number" min={1} value={startZone} onChange={e => setStartZone(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-28" />
          </div>
          <div>
            <label className="block text-xs text-slate-400 mb-1">End Zone</label>
            <input type="number" min={1} value={endZone} onChange={e => setEndZone(Number(e.target.value))}
              className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-28" />
          </div>
          <button onClick={handleRouteRecommend}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors">
            Get AI Route
          </button>
        </div>
        {routeResult && (
          <div className="bg-slate-950 border border-purple-800/50 rounded-lg p-4 fade-in">
            <p className="text-sm text-slate-200">
              <span className="text-purple-400 font-bold">Route:</span> Zone {routeResult.start_zone}
              {routeResult.waypoints.slice(1, -1).map(w => ` → Z${w}`)} → Zone {routeResult.end_zone}
            </p>
            <p className="text-xs text-slate-500 mt-1">AI-generated safe bypass route · Active: {routeResult.is_active ? 'Yes' : 'No'}</p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default CrowdDashboard

