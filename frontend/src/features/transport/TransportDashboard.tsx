import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageContainer } from '../../components/layout/PageContainer'

interface ParkingZone {
  id: number
  name: string
  max_capacity: number
  current_occupancy: number
  zone_type: string
}

interface SustainabilityMetrics {
  total_carbon_offset_kg: number
  renewable_energy_percentage: number
  water_usage_liters: number
  recycling_rate_percentage: number
  waste_diversion_percentage: number
  energy_cost_savings_usd: number
}

interface FanRecommendation {
  recommended_parking: string
  best_entrance: string
  shuttle_recommendation: string
  walking_time_minutes: number
}

const TransportDashboard: React.FC = () => {
  const [parking, setParking] = useState<ParkingZone[]>([])
  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null)
  const [recommendation, setRecommendation] = useState<FanRecommendation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/transport/parking'),
      axios.get('/api/sustainability/metrics'),
      axios.get('/api/transport/recommendations/fan/1'), // demo fan
    ]).then(([p, m, r]) => {
      setParking(p.data)
      setMetrics(m.data)
      setRecommendation(r.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const fillPct = (current: number, max: number) => max ? (current / max) : 0
  const barColor = (pct: number) => pct > 0.9 ? 'bg-red-500' : pct > 0.7 ? 'bg-amber-500' : 'bg-emerald-500'

  return (
    <PageContainer>
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-teal-400 tracking-tight">Transport & Sustainability Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Smart parking · Eco-metrics · Predictive traffic routing</p>
        </div>
        <span className="badge-healthy text-xs font-bold px-3 py-1 rounded-full text-emerald-400 border-emerald-400/30">🌿 ECO-SMART</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sustainability KPIs */}
        <div className="lg:col-span-2">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Sustainability Performance</h2>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1,2,3,4,5,6].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">🌿 Carbon Offset</p>
                <p className="text-2xl font-black text-emerald-400">{(metrics?.total_carbon_offset_kg || 0).toLocaleString()} <span className="text-sm font-normal">kg</span></p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">☀️ Renewable Energy</p>
                <p className="text-2xl font-black text-amber-400">{Math.round((metrics?.renewable_energy_percentage || 0) * 100)}%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">💧 Water Usage</p>
                <p className="text-2xl font-black text-cyan-400">{(metrics?.water_usage_liters || 0).toLocaleString()} <span className="text-sm font-normal">L</span></p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">♻️ Recycling Rate</p>
                <p className="text-2xl font-black text-teal-400">{Math.round((metrics?.recycling_rate_percentage || 0) * 100)}%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">🗑️ Waste Diversion</p>
                <p className="text-2xl font-black text-purple-400">{Math.round((metrics?.waste_diversion_percentage || 0) * 100)}%</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <p className="text-xs font-bold text-slate-400 uppercase mb-1">💰 Energy Savings</p>
                <p className="text-2xl font-black text-white">${(metrics?.energy_cost_savings_usd || 0).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        {/* Fan Recommendation */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <h2 className="text-lg font-bold text-slate-200 mb-4">Live Transport Profile</h2>
          {loading ? <div className="skeleton h-32 rounded-xl" /> : recommendation ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400">Recommended Parking</p>
                <p className="text-base font-bold text-white">{recommendation.recommended_parking}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Optimal Entrance</p>
                <p className="text-base font-bold text-cyan-400">{recommendation.best_entrance}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400">Shuttle Service</p>
                <p className="text-base font-bold text-amber-400">{recommendation.shuttle_recommendation}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <p className="text-xs text-slate-400">Estimated Walking Time</p>
                <p className="text-lg font-black text-emerald-400">{recommendation.walking_time_minutes} min</p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-500">No profile active.</p>
          )}
        </div>
      </div>

      {/* Parking Grid */}
      <h2 className="text-lg font-bold text-slate-200 mb-4">Smart Parking Occupancy</h2>
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : parking.length === 0 ? (
        <div className="text-center py-8 text-slate-500 bg-slate-900 rounded-xl border border-slate-800">
          <span className="text-4xl">🅿️</span>
          <p className="mt-2">No parking data available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {parking.map(p => {
            const pct = fillPct(p.current_occupancy, p.max_capacity)
            return (
              <div key={p.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-bold text-white">{p.name}</p>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    p.zone_type === 'ADA' ? 'bg-cyan-900 text-cyan-300' :
                    p.zone_type === 'VIP' ? 'bg-amber-900 text-amber-300' :
                    p.zone_type === 'EV' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-300'
                  }`}>{p.zone_type}</span>
                </div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">{p.current_occupancy} / {p.max_capacity}</span>
                  <span className={`font-bold ${pct > 0.9 ? 'text-red-400' : pct > 0.7 ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {Math.round(pct * 100)}%
                  </span>
                </div>
                <div className="progress-bar">
                  <div className={`progress-bar-fill ${barColor(pct)}`} style={{ width: `${pct * 100}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </PageContainer>
  )
}

export default TransportDashboard
