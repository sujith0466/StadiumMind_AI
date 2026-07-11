import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import FanPortal from './features/fan/FanPortal'
import EmergencyDashboard from './features/emergency/EmergencyDashboard'
import ExecutiveDashboard from './features/executive/ExecutiveDashboard'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Top Navigation */}
        <nav className="bg-slate-900 border-b border-slate-800 px-6 py-3 flex items-center space-x-6" role="navigation" aria-label="Main navigation">
          <span className="text-cyan-400 font-extrabold text-lg tracking-tight">StadiumMind AI</span>
          <NavLink
            to="/"
            className={({ isActive }: { isActive: boolean }) =>
              `text-sm font-semibold px-3 py-1.5 rounded transition-colors ${isActive ? 'bg-cyan-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
            }
          >
            Fan Portal
          </NavLink>
          <NavLink
            to="/executive"
            className={({ isActive }: { isActive: boolean }) =>
              `text-sm font-semibold px-3 py-1.5 rounded transition-colors ${isActive ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
            }
          >
            Executive Command
          </NavLink>
          <NavLink
            to="/emergency"
            className={({ isActive }: { isActive: boolean }) =>
              `text-sm font-semibold px-3 py-1.5 rounded transition-colors ${isActive ? 'bg-red-700 text-white' : 'text-slate-300 hover:text-white hover:bg-slate-800'}`
            }
          >
            Emergency Center
          </NavLink>
        </nav>

        {/* Routes */}
        <main>
          <Routes>
            <Route path="/" element={<FanPortal />} />
            <Route path="/executive" element={<ExecutiveDashboard />} />
            <Route path="/emergency" element={<EmergencyDashboard />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
