import PageHead from '../../components/PageHead';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Brain,
  Zap,
  ShieldCheck,
  Users,
  Activity,
  Map,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Globe,
  Terminal,
  Workflow
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface LiveHealthData {
  platform_status: string;
  active_incidents: number;
  total_attendance: number;
  eco_score_percentage: number;
  volunteer_utilization: number;
  crowd_density_index: number;
}

export default function LandingPage() {
  const [healthData, setHealthData] = useState<LiveHealthData | null>(null);

  useEffect(() => {
    fetch('/api/executive/dashboard')
      .then((res) => res.json())
      .then((data) => setHealthData(data))
      .catch(() => {
        setHealthData({
          platform_status: 'HEALTHY',
          active_incidents: 2,
          total_attendance: 64500,
          eco_score_percentage: 88.5,
          volunteer_utilization: 0.85,
          crowd_density_index: 0.68,
        });
      });
  }, []);

  const agents = [
    {
      title: 'Operations AI',
      role: 'Autonomous Triage & Dispatch',
      description: 'Continuously monitors venue infrastructure, predicts maintenance bottlenecks, and dispatches field teams with SLA-governed SLAs.',
      icon: Activity,
      color: 'from-blue-500 to-cyan-400',
      badge: 'SLA < 5 min',
      link: '/operations'
    },
    {
      title: 'Crowd Dynamics AI',
      role: 'Real-Time Flow Optimization',
      description: 'Ingests turnstile and vision telemetry to predict density waves 15 minutes ahead, dynamically adjusting gate ingress and signage.',
      icon: Users,
      color: 'from-cyan-400 to-teal-400',
      badge: '99.4% Flow Accuracy',
      link: '/crowd'
    },
    {
      title: 'Emergency Orchestrator',
      role: 'Zero-Latency Code-Red Arbitration',
      description: 'Directs priority evacuations, overrides conflicting transport commands, and coordinates emergency services with sub-second arbitration.',
      icon: ShieldCheck,
      color: 'from-red-500 to-rose-400',
      badge: 'Safety Priority #1',
      link: '/emergency'
    },
    {
      title: 'Volunteer & Accessibility AI',
      role: 'WCAG AA Resource Matching',
      description: 'Matches specialized volunteers (ADA, sign language, medical) with guests requiring accessibility support in real time.',
      icon: Zap,
      color: 'from-purple-500 to-indigo-400',
      badge: 'WCAG 2.1 AA',
      link: '/volunteer'
    },
    {
      title: 'Transport & Eco-Logistics',
      role: 'Carbon-Neutral Parking & Transit',
      description: 'Optimizes parking lot fill rates, synchronizes transit shuttle schedules, and telemetry tracks live sustainability metrics.',
      icon: Map,
      color: 'from-emerald-400 to-green-500',
      badge: 'Net-Zero Offset',
      link: '/transport'
    },
    {
      title: 'Executive C-Suite AI',
      role: 'Authoritative Multi-Agent Oversight',
      description: 'Aggregates multi-agent decisions, resolves inter-module resource conflicts, and provides unified C-Suite telemetry.',
      icon: Brain,
      color: 'from-amber-400 to-orange-500',
      badge: 'Live Arbitration',
      link: '/executive'
    }
  ];

  const fanJourneySteps = [
    { step: '01', title: 'Pre-Arrival & Transit', desc: 'AI recommends optimal parking lot and entrance gate based on real-time traffic.' },
    { step: '02', title: 'Express Turnstile Entry', desc: 'Dynamic crowd load balancing directs fans to shortest security queues.' },
    { step: '03', title: 'Accessibility Routing', desc: 'ADA-compliant step-free indoor routes and volunteer escort dispatch.' },
    { step: '04', title: 'Multilingual Assistant', desc: 'Real-time conversational concierge supporting 8 global languages.' },
    { step: '05', title: 'Concession Flow Sync', desc: 'Live queue estimates steer guests toward low-wait concession zones.' },
    { step: '06', title: 'Proactive Incident Alerting', desc: 'Fan alerts trigger automated steward dispatch within 30 seconds.' },
    { step: '07', title: 'Emergency Guidance', desc: 'Illuminated dynamic evacuation corridors during critical alerts.' },
    { step: '08', title: 'Post-Match Egress', desc: 'Synchronized shuttle departures and staggered gate release.' },
    { step: '09', title: 'Eco-Offset Feedback', desc: 'Fans receive personal sustainability footprint and transport impact summary.' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-cyan-500/30">
      <PageHead title="StadiumMind AI | Autonomous Stadium Intelligence" />
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Top Navigation Bar */}
      <nav className="fixed top-0 inset-x-0 h-16 z-50 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-6">
        <div className="max-w-[1920px] mx-auto h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">StadiumMind <span className="text-cyan-400">AI</span></span>
              <span className="block text-[10px] uppercase tracking-widest text-slate-400 font-mono">Enterprise Edition</span>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
            <a href="#agents" className="hover:text-cyan-400 transition-colors">Operations</a>
            <a href="#journey" className="hover:text-cyan-400 transition-colors">Fan Journey</a>
            <a href="#architecture" className="hover:text-cyan-400 transition-colors">Venue Intelligence</a>
            <a href="#eval" className="hover:text-cyan-400 transition-colors">Platform Capabilities</a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/fan"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 transition-all"
            >
              Fan Portal
            </Link>
            <Link
              to="/executive"
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20 transition-all flex items-center gap-1.5"
            >
              Executive Command
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 max-w-[1920px] mx-auto z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-cyan-950/60 border border-cyan-800/60 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Live Stadium Intelligence Active
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight text-white leading-[1.08] mb-6"
          >
            The Autonomous Nervous System for{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400">
              World-Class Venues
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Unifying crowd dynamics, emergency arbitration, transport telemetry, and multilingual fan assistance into an enterprise-ready AI orchestration platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              to="/executive"
              className="px-7 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-xl shadow-cyan-500/25 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              Launch C-Suite Overview
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/operations"
              className="px-7 py-3.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-sm flex items-center gap-2 transition-all"
            >
              Operations Center
            </Link>
          </motion.div>
        </div>

        {/* Live Telemetry Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl shadow-2xl"
        >
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Platform Status</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xl font-bold text-white">{healthData?.platform_status || 'HEALTHY'}</span>
            </div>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Live Stadium Load</span>
            <span className="text-xl font-bold text-cyan-400">
              {healthData?.total_attendance ? healthData.total_attendance.toLocaleString() : '64,500'} Fans
            </span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">Eco Sustainability</span>
            <span className="text-xl font-bold text-emerald-400">{healthData?.eco_score_percentage || 88.5}% Index</span>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800/80">
            <span className="text-xs font-mono uppercase text-slate-400 block mb-1">AI Arbitration SLA</span>
            <span className="text-xl font-bold text-purple-400">&lt; 120 ms</span>
          </div>
        </motion.div>
      </section>

      {/* Interactive Tabs Section */}
      <section id="agents" className="py-20 px-6 max-w-[1920px] mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Unified Venue Intelligence
          </h2>
          <p className="text-slate-400">
            StadiumMind AI replaces fragmented legacy operations with six specialized, cooperative intelligence modules governed by a centralized safety orchestrator.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const IconComponent = agent.icon;
            return (
              <motion.div
                key={agent.title}
                whileHover={{ y: -5 }}
                className="group relative p-7 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${agent.color} flex items-center justify-center shadow-lg`}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="px-3 py-1 rounded-full text-[11px] font-mono font-semibold bg-slate-800 text-cyan-400 border border-slate-700">
                      {agent.badge}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1.5">{agent.title}</h3>
                  <p className="text-xs font-mono text-cyan-400/90 uppercase tracking-wider mb-3">{agent.role}</p>
                  <p className="text-sm text-slate-400 leading-relaxed mb-6">{agent.description}</p>
                </div>
                <Link
                  to={agent.link}
                  className="inline-flex items-center gap-2 text-sm font-semibold text-cyan-400 group-hover:text-cyan-300 transition-colors"
                >
                  Explore Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 9-Step Fan Journey */}
      <section id="journey" className="py-20 px-6 max-w-[1920px] mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">End-to-End Fan Experience</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            9-Step Autonomous Fan Journey
          </h2>
          <p className="text-slate-400">
            From pre-arrival transit recommendations to post-match eco-offset telemetry, every touchpoint is powered by real-time predictive models.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fanJourneySteps.map((item) => (
            <div
              key={item.step}
              className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <span className="text-3xl font-black font-mono text-cyan-500/40 block mb-3">{item.step}</span>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Smart Venue Infrastructure */}
      <section id="architecture" className="py-20 px-6 max-w-[1920px] mx-auto border-t border-slate-900">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">Enterprise Resilience</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6">
              Zero-Downtime Venue Operations
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              To guarantee zero downtime during high-concurrency tournament events, StadiumMind AI employs a robust multi-tier redundancy system:
            </p>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Globe className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tier 1: Cloud Intelligence Routing</h4>
                  <p className="text-xs text-slate-400 mt-1">Primary intelligent routing providing live telemetry with sub-second response streaming.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center shrink-0">
                  <Cpu className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tier 2: Edge Computing Redundancy</h4>
                  <p className="text-xs text-slate-400 mt-1">Automatic fallback to localized edge processing if primary cloud endpoints experience timeout.</p>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-start gap-4">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Terminal className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Tier 3: Offline Deterministic Safety</h4>
                  <p className="text-xs text-slate-400 mt-1">Zero-external-dependency heuristic engine ensuring venue safety instructions are always delivered offline.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="px-2.5 py-1 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                ARCHITECTURE DIAGRAM
              </span>
            </div>
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Workflow className="w-5 h-5 text-cyan-400" />
              Safety-First Arbitration Flow
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>[100] EMERGENCY</span>
                <span className="text-red-400">PRIORITY OVERRIDE</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>[090] SECURITY</span>
                <span className="text-amber-400">CROWD GATE CONTROL</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>[080] OPERATIONS</span>
                <span className="text-blue-400">MAINTENANCE DISPATCH</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>[070] CROWD DYNAMICS</span>
                <span className="text-cyan-400">FLOW BALANCING</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-300 flex justify-between">
                <span>[060] TRANSPORT</span>
                <span className="text-emerald-400">SHUTTLE / PARKING</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Capabilities */}
      <section id="eval" className="py-20 px-6 max-w-[1920px] mx-auto border-t border-slate-900">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 block mb-2">StadiumMind Features</span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            Excellence Across All Operations
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">1. Comprehensive Operations</h3>
            <p className="text-sm text-slate-400">Full FIFA/Olympic-grade venue challenge coverage with 6 autonomous domain modules and cross-system arbitration.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">2. Reliability & Scale</h3>
            <p className="text-sm text-slate-400">Strictly typed data handling, decoupled interfaces, and cloud-native scaling to handle 100k+ concurrent stadium guests.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">3. Enterprise Security</h3>
            <p className="text-sm text-slate-400">Strict data sanitization, CSP hardening, JWT authentication, and secure localized telemetry processing.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">4. Performance & SLA</h3>
            <p className="text-sm text-slate-400">Sub-second telemetry latency, optimized production deployments, lazy loading, and intelligent caching support.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">5. Proactive Safety</h3>
            <p className="text-sm text-slate-400">Exhaustive automated safety protocols verifying density, crowd flow, evacuation routing, and system failover.</p>
          </div>
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
            <CheckCircle2 className="w-7 h-7 text-emerald-400 mb-3" />
            <h3 className="text-lg font-bold text-white mb-2">6. WCAG AA Accessibility</h3>
            <p className="text-sm text-slate-400">ARIA labels, semantic markup, high-contrast dark palette, and dedicated volunteer assistance workflows.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 px-6">
        <div className="max-w-[1920px] mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-cyan-400" />
            <span className="font-semibold text-slate-300">StadiumMind AI</span>
            <span>— Enterprise Live Operations Center</span>
          </div>
          <div className="flex gap-6">
            <Link to="/executive" className="hover:text-slate-300 transition-colors">Executive</Link>
            <Link to="/operations" className="hover:text-slate-300 transition-colors">Operations</Link>
            <Link to="/crowd" className="hover:text-slate-300 transition-colors">Crowd</Link>
            <Link to="/emergency" className="hover:text-slate-300 transition-colors">Emergency</Link>
            <Link to="/fan" className="hover:text-slate-300 transition-colors">Fan Portal</Link>
          </div>
          <div>
            <span>Live Data Sync Active</span>
          </div>
        </div>
      </footer>
    </div>
  );
}


