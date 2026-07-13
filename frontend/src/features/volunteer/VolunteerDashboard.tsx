import PageHead from '../../components/PageHead';
import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { PageContainer } from '../../components/layout/PageContainer'

interface Volunteer {
  id: number
  name: string
  active: boolean
  medical_training?: boolean
  mobility_assistance?: boolean
  sign_language?: boolean
  security_clearance?: boolean
}

interface AccessibilityAnalytics {
  avg_response_time: number
  request_categories: Record<string, number>
  volunteer_utilization: number
  translation_success_rate: number
  route_success_rate: number
}

const CAPABILITY_ICONS: Record<string, string> = {
  medical_training: '🏥',
  mobility_assistance: '♿',
  sign_language: '🤟',
  security_clearance: '🔒',
}

const VolunteerDashboard: React.FC = () => {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [analytics, setAnalytics] = useState<AccessibilityAnalytics | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      axios.get('/api/volunteers/'),
      axios.get('/api/accessibility/analytics'),
    ]).then(([v, a]) => {
      setVolunteers(Array.isArray(v.data) ? v.data : [])
      setAnalytics(a.data)
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const activeCount = Array.isArray(volunteers) ? volunteers.filter(v => v.active).length : 0;

  const AnalyticsBar = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={`font-bold ${color}`}>{Math.round(value * 100)}%</span>
      </div>
      <div className="progress-bar">
        <div className={`progress-bar-fill ${color.replace('text-', 'bg-')}`} style={{ width: `${value * 100}%` }} />
      </div>
    </div>
  )

  return (
    <PageContainer>
      <PageHead title="Volunteer Coordination" />
      {/* Header */}
      <header className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-black text-emerald-400 tracking-tight">Volunteer & Accessibility Intelligence</h1>
          <p className="text-sm text-slate-400 mt-1">Dispatch coordination · Accessibility analytics · SLA tracking</p>
        </div>
        <span className="badge-healthy text-xs font-bold px-3 py-1 rounded-full" aria-label="System Status: ADA COMPLIANT">ADA COMPLIANT</span>
      </header>

      {/* KPIs */}
      <section aria-label="Key Performance Indicators">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" aria-label="Loading KPIs" aria-hidden="true">
            {[1,2,3,4].map(i => <div key={i} className="skeleton h-24 rounded-xl" />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8" aria-live="polite">
            <article className="bg-slate-900 p-5 rounded-xl border border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">🤝 Total Volunteers</h2>
              <p className="text-3xl font-black text-white">{volunteers.length}</p>
            </article>
            <article className="bg-slate-900 p-5 rounded-xl border border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">✅ Active Now</h2>
              <p className="text-3xl font-black text-emerald-400">{activeCount}</p>
            </article>
            <article className="bg-slate-900 p-5 rounded-xl border border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">⏱ Avg Response</h2>
              <p className="text-3xl font-black text-cyan-400">{analytics?.avg_response_time ?? 0}<span className="text-sm" aria-label="seconds">s</span></p>
            </article>
            <article className="bg-slate-900 p-5 rounded-xl border border-slate-800">
              <h2 className="text-xs font-bold text-slate-400 uppercase mb-1">🌐 Translation Rate</h2>
              <p className="text-3xl font-black text-amber-400">
                {Math.round((analytics?.translation_success_rate ?? 0) * 100)}%
              </p>
            </article>
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Volunteer List */}
        <section className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-5" aria-labelledby="volunteer-roster-title">
          <h2 id="volunteer-roster-title" className="text-lg font-bold text-slate-200 mb-4">Volunteer Roster</h2>
          {volunteers.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <span className="text-4xl" aria-hidden="true">👥</span>
              <p className="mt-2">No volunteers in database yet</p>
              <p className="text-xs mt-1">Volunteer records will appear here once seeded</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="Volunteer roster">
                <thead>
                  <tr className="border-b border-slate-800">
                    <th scope="col" className="text-left text-xs text-slate-400 py-2 pr-4">ID</th>
                    <th scope="col" className="text-left text-xs text-slate-400 py-2 pr-4">Name</th>
                    <th scope="col" className="text-left text-xs text-slate-400 py-2 pr-4">Status</th>
                    <th scope="col" className="text-left text-xs text-slate-400 py-2">Capabilities</th>
                  </tr>
                </thead>
                <tbody aria-live="polite">
                  {volunteers.map(v => (
                    <tr key={v.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                      <td className="py-2.5 pr-4 font-mono text-slate-400">#{v.id}</td>
                      <td className="py-2.5 pr-4 text-slate-200 font-medium">{v.name}</td>
                      <td className="py-2.5 pr-4">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${v.active ? 'badge-healthy' : 'badge-warning'}`}>
                          {v.active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-2.5">
                        <div className="flex gap-1" role="group" aria-label="Capabilities">
                          {(['medical_training', 'mobility_assistance', 'sign_language', 'security_clearance'] as const).map(cap =>
                            v[cap] ? (
                              <span key={cap} title={cap.replace('_', ' ')} aria-label={cap.replace('_', ' ')} className="text-base">{CAPABILITY_ICONS[cap]}</span>
                            ) : null
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        {/* Analytics */}
        <section className="bg-slate-900 rounded-xl border border-slate-800 p-5" aria-labelledby="analytics-title">
          <h2 id="analytics-title" className="text-lg font-bold text-slate-200 mb-4">Accessibility Analytics</h2>
          {loading ? <div className="skeleton h-48 rounded-xl" aria-label="Loading analytics" aria-hidden="true" /> : (
            <div className="space-y-4" aria-live="polite">
              <AnalyticsBar label="Volunteer Utilization" value={analytics?.volunteer_utilization ?? 0} color="text-emerald-400" />
              <AnalyticsBar label="Translation Success" value={analytics?.translation_success_rate ?? 0} color="text-cyan-400" />
              <AnalyticsBar label="Route Success Rate" value={analytics?.route_success_rate ?? 0} color="text-amber-400" />
              {analytics?.request_categories && Object.keys(analytics.request_categories).length > 0 && (
                <div>
                  <h3 className="text-xs text-slate-400 mb-2 mt-2">Request Categories</h3>
                  {Object.entries(analytics.request_categories).map(([cat, count]) => (
                    <div key={cat} className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400 capitalize">{cat}</span>
                      <span className="font-bold text-slate-200">{count}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </PageContainer>
  )
}

export default VolunteerDashboard


