import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import LandingPage from './features/landing/LandingPage';
import FanPortal from './features/fan/FanPortal';
import EmergencyDashboard from './features/emergency/EmergencyDashboard';
import ExecutiveDashboard from './features/executive/ExecutiveDashboard';
import OperationsDashboard from './features/operations/Dashboard';
import CrowdDashboard from './features/crowd/CrowdDashboard';
import VolunteerDashboard from './features/volunteer/VolunteerDashboard';
import TransportDashboard from './features/transport/TransportDashboard';
import { LanguageProvider, useLanguage, type LanguageCode } from './context/LanguageContext';
import { Brain, Bell, ShieldCheck, Globe, Menu, X, CheckCheck, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const NAV_ITEMS = [
  { path: '/fan',        labelKey: '⚽ Fan Portal',       badge: 'LIVE' },
  { path: '/executive',  labelKey: '📊 Executive',        badge: null },
  { path: '/emergency',  labelKey: '🚨 Emergency',        badge: null },
  { path: '/operations', labelKey: '⚙️ Operations',       badge: null },
  { path: '/crowd',      labelKey: '👥 Crowd',            badge: null },
  { path: '/volunteer',  labelKey: '🤝 Volunteers',       badge: null },
  { path: '/transport',  labelKey: '🚌 Transport',        badge: null },
];

import { useState } from 'react';

function GlobalNavbar() {
  const { language, setLanguage, translate } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'alert', title: 'High Density at Gate 4', time: 'Just now', read: false },
    { id: 2, type: 'info', title: 'System Optimized', time: '5m ago', read: false },
    { id: 3, type: 'success', title: 'SLA Met: Egress Flow', time: '12m ago', read: true },
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <>
      <header className="sticky top-0 inset-x-0 h-16 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 transition-all">
        <div className="max-w-7xl mx-auto h-full flex items-center justify-between gap-4">
          {/* Brand Link — Clicking StadiumMind AI ALWAYS navigates to "/" */}
          <NavLink
            to="/"
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded-xl py-1 shrink-0"
            aria-label="StadiumMind AI — Back to Landing Page"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-4 h-4 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-bold tracking-tight text-white group-hover:text-cyan-400 transition-colors">
                StadiumMind <span className="text-cyan-400 font-light">AI</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-400 font-mono">
                Championship Operations
              </span>
            </div>
          </NavLink>

          {/* Navigation Items (Desktop) */}
          <nav
            className="hidden xl:flex items-center gap-1 overflow-x-auto no-scrollbar"
            role="navigation"
            aria-label="Main navigation"
          >
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }: { isActive: boolean }) =>
                  `relative px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-slate-900 text-cyan-400 border border-slate-800 shadow-sm'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                  }`
                }
              >
                <span>{translate(item.labelKey)}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Controls: Single Global Language Selector + System Status */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1 text-xs transition-colors hover:border-slate-700">
              <Globe className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as LanguageCode)}
                aria-label="Select Global Preferred Language"
                className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="en" className="bg-slate-900">English (EN)</option>
                <option value="es" className="bg-slate-900">Español (ES)</option>
                <option value="fr" className="bg-slate-900">Français (FR)</option>
                <option value="de" className="bg-slate-900">Deutsch (DE)</option>
                <option value="ar" className="bg-slate-900">العربية (AR)</option>
                <option value="zh" className="bg-slate-900">中文 (ZH)</option>
                <option value="pt" className="bg-slate-900">Português (PT)</option>
                <option value="hi" className="bg-slate-900">हिन्दी (HI)</option>
              </select>
            </div>

            {/* Removed Verified Live badge as requested */}

            {/* Premium Notifications Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                aria-label="System Notifications"
                className={`p-2 rounded-xl border transition-all relative flex items-center justify-center group ${
                  notificationsOpen 
                    ? 'bg-slate-800/80 border-cyan-500/30 text-white shadow-[0_0_15px_rgba(6,182,212,0.15)]' 
                    : 'bg-slate-900/50 backdrop-blur-sm border-slate-800 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400'
                }`}
              >
                <Bell className={`w-4 h-4 transition-transform ${notificationsOpen ? 'scale-110' : 'group-hover:rotate-12'}`} />
                {unreadCount > 0 && (
                  <>
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-500 border-2 border-slate-950 z-10" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-cyan-400 opacity-75 animate-ping" />
                  </>
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-40 lg:hidden"
                      onClick={() => setNotificationsOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl bg-slate-950/95 backdrop-blur-2xl border border-slate-800 shadow-2xl z-50 overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-slate-800/80 bg-slate-900/50">
                        <div className="flex items-center gap-2">
                          <Bell className="w-4 h-4 text-cyan-400" />
                          <h3 className="text-sm font-bold text-white">Notifications</h3>
                          {unreadCount > 0 && (
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              {unreadCount} NEW
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button 
                            onClick={markAllAsRead}
                            className="text-[10px] font-bold text-slate-400 hover:text-cyan-400 transition-colors flex items-center gap-1 uppercase"
                          >
                            <CheckCheck className="w-3 h-3" />
                            Mark Read
                          </button>
                        )}
                      </div>
                      <div className="max-h-[300px] overflow-y-auto p-2 space-y-1 custom-scrollbar">
                        {notifications.map((notif) => (
                          <div 
                            key={notif.id} 
                            className={`p-3 rounded-xl flex items-start gap-3 transition-colors ${
                              notif.read ? 'opacity-70 hover:bg-slate-900/40' : 'bg-slate-900/60 border border-slate-800/50 hover:bg-slate-900/80'
                            }`}
                          >
                            <div className="mt-0.5 shrink-0">
                              {notif.type === 'alert' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
                              {notif.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
                              {notif.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm truncate ${notif.read ? 'text-slate-300' : 'text-white font-semibold'}`}>
                                {notif.title}
                              </p>
                              <p className="text-[10px] text-slate-500 font-mono mt-1">{notif.time}</p>
                            </div>
                            {!notif.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0 mt-1.5" />
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="p-3 border-t border-slate-800/80 bg-slate-950 text-center">
                        <button className="text-xs font-semibold text-slate-400 hover:text-white transition-colors">
                          View Activity Log
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle mobile menu"
              className="xl:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-16 z-40 bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 flex flex-col p-4 gap-2 h-fit max-h-[80vh] overflow-y-auto shadow-2xl">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }: { isActive: boolean }) =>
                `px-4 py-3 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  isActive
                    ? 'bg-slate-900 text-cyan-400 border border-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/50'
                }`
              }
            >
              <span>{translate(item.labelKey)}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center justify-between">
            {/* Removed Verified Live badge as requested */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">Championship Mode</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AppContent() {
  const location = useLocation();
  const isLanding = location.pathname === '/';

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col font-sans antialiased selection:bg-cyan-500/30">
      {!isLanding && <GlobalNavbar />}
      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/"           element={<LandingPage />} />
          <Route path="/fan"        element={<FanPortal />} />
          <Route path="/executive"  element={<ExecutiveDashboard />} />
          <Route path="/emergency"  element={<EmergencyDashboard />} />
          <Route path="/operations" element={<OperationsDashboard />} />
          <Route path="/crowd"      element={<CrowdDashboard />} />
          <Route path="/volunteer"  element={<VolunteerDashboard />} />
          <Route path="/transport"  element={<TransportDashboard />} />
        </Routes>
      </main>
      {!isLanding && (
        <footer className="border-t border-slate-800/80 bg-slate-950 px-6 py-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-slate-500">
            <span>StadiumMind AI · Verified Live Stadium Telemetry & Operations</span>
            <span className="font-mono text-[11px]">Enterprise Safety Operations Certified</span>
          </div>
        </footer>
      )}
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </LanguageProvider>
  );
}

export default App;
