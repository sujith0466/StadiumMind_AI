import PageHead from '../../components/PageHead';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageContainer } from '../../components/layout/PageContainer'

interface Incident {
  id: number
  severity: string
  status: string
  zone_id: number
  created_at: string
}

interface OpsKPI {
  total_incidents: number
  open_incidents: number
  resolved_incidents: number
  active_zones: number
}

const SEVERITY_COLOR: Record<string, string> = {
  LOW: 'badge-healthy',
  MEDIUM: 'badge-info',
  HIGH: 'badge-warning',
  CRITICAL: 'badge-critical',
}

const STATUS_COLOR: Record<string, string> = {
  OPEN: 'badge-warning',
  RESOLVED: 'badge-healthy',
  CLOSED: 'bg-slate-800 text-slate-400 border-slate-700',
}

const OperationsDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [kpi, setKpi] = useState<OpsKPI | null>(null)
  const [loading, setLoading] = useState(true)
  const [newSeverity, setNewSeverity] = useState('MEDIUM')
  const [newZone, setNewZone] = useState(1)
  const [aiRec, setAiRec] = useState<string | null>(null)

  const fetchData = () => {
    Promise.all([
      axios.get('/api/ops/incidents'),
      axios.get('/api/ops/dashboard'),
    ]).then(([i, k]) => {
      setIncidents(i.data)
      setKpi(k.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const handleCreate = async () => {
    try {
      const r = await axios.post('/api/ops/incidents', {
        severity: newSeverity,
        zone_id: newZone
      })
      setAiRec(r.data.ai_recommendation || 'No recommendation provided.')
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  const handleResolve = async (id: number) => {
    try {
      await axios.patch(`/api/ops/incidents/${id}`, { status: 'RESOLVED' })
      fetchData()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <PageContainer>
      <PageHead title="Operations Command" />
      {/* Header */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-blue-400 tracking-tight">Operations Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Incident tracking · Staff dispatch · AI triage</p>
        </div>
        <span className="badge-info text-xs font-bold px-3 py-1 rounded-full text-blue-400 border-blue-400/30">● LIVE</span>
      </div>

      {/* KPIs */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Total Incidents</p>
            <p className="text-3xl font-black text-white">{kpi?.total_incidents ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Open</p>
            <p className="text-3xl font-black text-amber-400">{kpi?.open_incidents ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Resolved</p>
            <p className="text-3xl font-black text-emerald-400">{kpi?.resolved_incidents ?? 0}</p>
          </div>
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
            <p className="text-xs font-bold text-slate-400 uppercase mb-1">Active Zones</p>
            <p className="text-3xl font-black text-blue-400">{kpi?.active_zones ?? 0}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Incident Table */}
        <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-200">Incident Log</h2>
          </div>
          {incidents.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <span className="text-4xl">📋</span>
              <p className="mt-2">No incidents logged.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th className="text-left text-xs text-slate-500 py-2">ID</th>
                    <th className="text-left text-xs text-slate-500 py-2">Severity</th>
                    <th className="text-left text-xs text-slate-500 py-2">Status</th>
                    <th className="text-left text-xs text-slate-500 py-2">Zone</th>
                    <th className="text-left text-xs text-slate-500 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {incidents.map(inc => (
                    <tr key={inc.id} className="border-b border-slate-800/50 hover:bg-slate-800/30">
                      <td className="py-3 font-mono text-slate-500">#{inc.id}</td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${SEVERITY_COLOR[inc.severity] || 'badge-info'}`}>
                          {inc.severity}
                        </span>
                      </td>
                      <td className="py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_COLOR[inc.status] || 'badge-info'}`}>
                          {inc.status}
                        </span>
                      </td>
                      <td className="py-3 text-slate-300">Zone {inc.zone_id}</td>
                      <td className="py-3">
                        {inc.status !== 'RESOLVED' && (
                          <button onClick={() => handleResolve(inc.id)}
                            className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded border border-slate-700 transition-colors">
                            Resolve
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h2 className="text-lg font-bold text-slate-200 mb-4">Report Incident</h2>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Severity</label>
                <select value={newSeverity} onChange={e => setNewSeverity(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white">
                  {['LOW','MEDIUM','HIGH','CRITICAL'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Zone ID</label>
                <input type="number" min={1} value={newZone} onChange={e => setNewZone(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white" />
              </div>
              <button onClick={handleCreate}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-colors mt-2">
                Create & Request AI Triage
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5 min-h-[150px]">
            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-3">🧠 AI Recommendation</h2>
            {aiRec ? (
              <div className="p-3 bg-slate-950 border border-blue-900/50 rounded-lg fade-in text-sm text-slate-300 leading-relaxed">
                {aiRec}
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">Submit an incident to receive AI triage recommendations.</p>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OperationsDashboard

