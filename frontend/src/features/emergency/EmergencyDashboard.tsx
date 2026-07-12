import PageHead from '../../components/PageHead';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageContainer } from '../../components/layout/PageContainer'

interface Incident {
  id: number
  severity: string
  incident_type: string
  zone_id: number
  status: string
  timestamp: string | null
}

const SEVERITY_COLOR: Record<string, string> = {
  MINOR:       'badge-info',
  MODERATE:    'badge-warning',
  SERIOUS:     'badge-warning',
  CRITICAL:    'badge-critical',
  CATASTROPHIC:'badge-critical',
}

const Skeleton = () => (
  <div className="space-y-3">
    {[1,2,3].map(i => <div key={i} className="skeleton h-12 w-full" />)}
  </div>
)

const EmergencyDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [query, setQuery] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [aiProvider, setAiProvider] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [queryLoading, setQueryLoading] = useState(false)
  const [newSeverity, setNewSeverity] = useState('CRITICAL')
  const [newZone, setNewZone] = useState(1)

  const fetchIncidents = () => {
    axios.get('/api/emergency/incidents')
      .then(r => setIncidents(Array.isArray(r.data) ? r.data : []))
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchIncidents() }, [])

  const handleQuery = async () => {
    if (!query.trim()) return
    setQueryLoading(true)
    try {
      const r = await axios.post('/api/knowledge/query', { question: query, language: 'en' })
      setAiResponse(r.data.ai_answer)
      setAiProvider(r.data.provider || 'local')
    } catch { setAiResponse('Unable to reach Knowledge Assistant. Please contact staff.') }
    finally { setQueryLoading(false) }
  }

  const handleEvacuate = async () => {
    if (window.confirm('CRITICAL: Trigger full stadium evacuation?')) {
      await axios.post('/api/emergency/evacuations', { zone_id: null })
      alert('Evacuation order transmitted! Refer to evacuation routes 1, 2, 5.')
    }
  }

  const handleEscalate = async () => {
    await axios.post('/api/emergency/incidents', {
      severity: newSeverity, incident_type: 'SECURITY', zone_id: newZone
    })
    fetchIncidents()
  }

  return (
    <PageContainer>
      <PageHead title="Emergency Operations Center" />
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center border-b border-slate-800 pb-4 mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-black text-red-400 tracking-tight">Emergency Command Center</h1>
          <p className="text-sm text-slate-400 mt-1">Real-time incident triage · Knowledge Assistant · Evacuation control</p>
        </div>
        <button
          onClick={handleEvacuate}
          className="bg-red-600 hover:bg-red-700 text-white font-black py-2.5 px-8 rounded-lg shadow-lg transition-all animate-pulse focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-slate-950"
          aria-label="Trigger full stadium evacuation"
        >
          🚨 TRIGGER EVACUATION
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Incident Feed + Escalate */}
        <div className="lg:col-span-2 space-y-6">
          {/* Escalate new incident */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h2 className="text-lg font-bold text-red-300 mb-4">Escalate New Incident</h2>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Severity</label>
                <select
                  value={newSeverity}
                  onChange={e => setNewSeverity(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm"
                >
                  {['MINOR','MODERATE','SERIOUS','CRITICAL','CATASTROPHIC'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-slate-400 mb-1">Zone ID</label>
                <input
                  type="number" min={1} max={20} value={newZone}
                  onChange={e => setNewZone(Number(e.target.value))}
                  className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-24"
                />
              </div>
              <button
                onClick={handleEscalate}
                className="bg-red-700 hover:bg-red-800 text-white font-bold px-6 py-2 rounded-lg text-sm transition-colors"
              >
                Escalate
              </button>
            </div>
          </div>

          {/* Active incidents */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
            <h2 className="text-lg font-bold text-slate-200 mb-4">
              Active Incidents
              <span className="ml-2 text-xs font-mono badge-critical px-2 py-0.5 rounded-full">{incidents.length}</span>
            </h2>
            {loading ? <Skeleton /> : incidents.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <span className="text-4xl">✅</span>
                <p className="mt-2">No active incidents</p>
              </div>
            ) : (
              <div className="space-y-2">
                {incidents.map(inc => (
                  <div key={inc.id} role="alert" className="flex items-center justify-between bg-slate-950 px-4 py-3 rounded-lg border border-slate-800">
                    <div>
                      <span className="font-mono text-xs text-slate-500 mr-2">#{inc.id}</span>
                      <span className="font-semibold text-slate-200 mr-2">{inc.incident_type}</span>
                      <span className="text-xs text-slate-400">Zone {inc.zone_id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${SEVERITY_COLOR[inc.severity] || 'badge-info'}`}>
                        {inc.severity}
                      </span>
                      <span className="text-xs text-slate-400">{inc.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Knowledge Assistant */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-5">
          <h2 className="text-lg font-bold text-slate-200 mb-1">Knowledge Assistant</h2>
          <p className="text-xs text-slate-500 mb-4">RAG · OpenRouter → Gemini → Local fallback</p>
          <div className="space-y-3">
            <textarea
              rows={3}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="e.g. Protocol for severe weather?"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm placeholder-slate-600 resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500"
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleQuery() } }}
            />
            <button
              onClick={handleQuery}
              disabled={queryLoading}
              className="w-full bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 text-white font-bold py-2 rounded-lg text-sm transition-colors"
            >
              {queryLoading ? 'Consulting AI...' : 'Ask Assistant'}
            </button>
          </div>
          {aiResponse && (
            <div className="mt-4 p-4 bg-slate-950 border-l-4 border-cyan-500 rounded-r-lg fade-in">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-cyan-400">AI RESPONSE</span>
                <span className="text-xs text-slate-500 font-mono">{aiProvider}</span>
              </div>
              <p className="text-sm text-slate-200 leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default EmergencyDashboard


