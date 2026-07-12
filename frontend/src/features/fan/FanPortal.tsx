import { useEffect, useState, useRef, useCallback, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../../context/LanguageContext';
import { PageContainer } from '../../components/layout/PageContainer';
import {
  Brain,
  Sparkles,
  MapPin,
  Utensils,
  Navigation,
  Accessibility,
  Copy,
  Check,
  RefreshCw,
  Mic,
  MicOff,
  Send,
  ChevronRight,
  CloudSun,
  Users,
  Compass,
  HeartPulse,
  ShoppingBag,
  Zap,
  CreditCard,
  Info,
  Car,
  AlertTriangle,
  ThumbsUp,
  ThumbsDown,
  Volume2,
  VolumeX,
  Heart,
  Clock,
  ShieldCheck,
  TrendingUp,
  Layers,
  Award
} from 'lucide-react';

interface FanJourneyStep {
  step_name: string;
  mapped_intelligence_module: string;
  description: string;
  status?: string;
  progress_pct?: number;
  est_completion?: string;
}

interface POI {
  id: number;
  name: string;
  category: string;
  zone_id: number;
  accessibility_equipped: boolean;
  distance_m?: number;
  walking_time_mins?: number;
  crowd_level_pct?: number;
  status?: string;
}

interface LiveMatchData {
  event_name: string;
  home_team: string;
  away_team: string;
  score: string;
  minute: string;
  status: string;
  stadium: string;
  attendance: number;
  weather: string;
  temperature?: string;
  possession?: string;
  crowd_density?: string;
  transportation_status?: string;
  security_level?: string;
  estimated_exit_congestion?: string;
  ai_prediction?: string;
  next_recommendation?: string;
}

interface AdvisoryItem {
  id: string;
  priority: string;
  severity: string;
  type: string;
  badge: string;
  title: string;
  message: string;
  timestamp: string;
  target_zone?: string;
}

interface MessageItem {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  provider?: string;
  grounded?: boolean;
  liked?: boolean | null;
  pinned?: boolean;
}

interface ActionRecommendation {
  title: string;
  route: string;
  estimated_time_mins: number;
  walking_distance_m?: number;
  crowd_level?: string;
  accessibility?: string;
  target_zone: string;
  confidence: string;
}

const CATEGORY_META: Record<string, { label: string; icon: any; colorClass: string; bgClass: string }> = {
  MEDICAL: { label: 'Medical & First Aid', icon: HeartPulse, colorClass: 'text-rose-400', bgClass: 'bg-rose-500/10 border-rose-500/30' },
  RESTROOM: { label: 'Restrooms & ADA', icon: Accessibility, colorClass: 'text-cyan-400', bgClass: 'bg-cyan-500/10 border-cyan-500/30' },
  FOOD: { label: 'Dining & Concessions', icon: Utensils, colorClass: 'text-amber-400', bgClass: 'bg-amber-500/10 border-amber-500/30' },
  MERCH: { label: 'Official Stores', icon: ShoppingBag, colorClass: 'text-purple-400', bgClass: 'bg-purple-500/10 border-purple-500/30' },
  ENTRANCE: { label: 'Gates & Entrances', icon: Navigation, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-500/10 border-emerald-500/30' },
  TRANSPORT: { label: 'Transit & Shuttles', icon: Compass, colorClass: 'text-blue-400', bgClass: 'bg-blue-500/10 border-blue-500/30' },
  CHARGING: { label: 'Mobile Power Hubs', icon: Zap, colorClass: 'text-yellow-400', bgClass: 'bg-yellow-500/10 border-yellow-500/30' },
  ATM: { label: 'Banking & ATMs', icon: CreditCard, colorClass: 'text-teal-400', bgClass: 'bg-teal-500/10 border-teal-500/30' },
  INFO: { label: 'Guest Concierge', icon: Info, colorClass: 'text-indigo-400', bgClass: 'bg-indigo-500/10 border-indigo-500/30' },
  PARKING: { label: 'Smart Parking', icon: Car, colorClass: 'text-sky-400', bgClass: 'bg-sky-500/10 border-sky-500/30' }
};

const STEP_ICONS: Record<string, string> = {
  ARRIVAL: '🚗',
  PARKING: '🅿️',
  SECURITY: '🛡️',
  ENTRY: '🚪',
  SEAT: '💺',
  FOOD: '🍔',
  RESTROOM: '🚻',
  SHOPPING: '🛍️',
  ENTERTAINMENT: '🎉',
  MATCH: '⚽',
  EXIT: '🚶',
  TRANSPORT_HOME: '🚌'
};

const MULTILINGUAL_UI: Record<string, { welcome: string; askPlaceholder: string; suggestionsTitle: string; onlineBadge: string }> = {
  en: {
    welcome: 'Welcome to Grand Metropolitan Arena! Ask me anything about accessible routing, dining queues, parking availability, or emergency exits.',
    askPlaceholder: 'Ask for directions, food queues, accessible facilities...',
    suggestionsTitle: 'Suggested Queries',
    onlineBadge: 'Live Stadium Services Online'
  },
  es: {
    welcome: '¡Bienvenido al Grand Metropolitan Arena! Pregúnteme sobre rutas accesibles, colas de comida, estacionamiento o salidas.',
    askPlaceholder: 'Preguntar por direcciones, colas de comida, baños accesibles...',
    suggestionsTitle: 'Consultas Sugeridas',
    onlineBadge: 'Servicios en Vivo Activos'
  },
  fr: {
    welcome: 'Bienvenue au Grand Metropolitan Arena ! Posez-moi vos questions sur les accès, la restauration ou les parkings.',
    askPlaceholder: 'Demander un itinéraire, temps d’attente, toilettes ADA...',
    suggestionsTitle: 'Suggestions AI',
    onlineBadge: 'Services en Direct Actifs'
  },
  de: {
    welcome: 'Willkommen in der Grand Metropolitan Arena! Fragen Sie mich nach barrierefreien Wegen, Gastronomie oder Parkplätzen.',
    askPlaceholder: 'Wegbeschreibung, Wartezeiten, barrierefreie Toiletten...',
    suggestionsTitle: 'Empfohlene Fragen',
    onlineBadge: 'Live-Stadiondienste Online'
  },
  ar: {
    welcome: 'مرحبًا بك في جراند متروبوليتان أرينا! اسألني عن الممرات الميسرة أو طوابير الطعام أو مواقف السيارات.',
    askPlaceholder: 'اسأل عن التوجيهات، طوابير الطعام، المرافق الميسرة...',
    suggestionsTitle: 'أسئلة مقترحة',
    onlineBadge: 'خدمات الملعب المباشرة متصلة'
  },
  zh: {
    welcome: '欢迎光临大都会体育场！有任何关于无障碍通道、餐饮排队、停车或出口的问题，请随时问我。',
    askPlaceholder: '询问路线、餐饮排队时间、无障碍卫生间...',
    suggestionsTitle: '智能建议问题',
    onlineBadge: '实时场馆服务在线'
  },
  pt: {
    welcome: 'Bem-vindo à Grand Metropolitan Arena! Pergunte-me sobre rotas acessíveis, filas de alimentação ou estacionamento.',
    askPlaceholder: 'Pergunte sobre direções, filas, banheiros acessíveis...',
    suggestionsTitle: 'Perguntas Sugeridas',
    onlineBadge: 'Serviços do Estádio Online'
  },
  hi: {
    welcome: 'ग्रैंड मेट्रोपोलिटन एरिना में आपका स्वागत है! सुलभ रास्तों, भोजन कतारों या पार्किंग के बारे में मुझसे पूछें।',
    askPlaceholder: 'दिशा-निर्देश, खाने की कतारें, सुलभ सुविधाओं के बारे में पूछें...',
    suggestionsTitle: 'सुझाए गए प्रश्न',
    onlineBadge: 'लाइव स्टेडियम सेवाएं सक्रिय'
  }
};

export default function FanPortal() {
  // --- Dynamic State ---
  const [journeySteps, setJourneySteps] = useState<FanJourneyStep[]>([]);
  const [pois, setPois] = useState<POI[]>([]);
  const [liveMatch, setLiveMatch] = useState<LiveMatchData | null>(null);
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  // --- UI State ---
  // --- UI State (Language from Global Context) ---
  const { language, translate } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeStepName, setActiveStepName] = useState<string | null>('ARRIVAL');
  const [dismissedAdvisories, setDismissedAdvisories] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [expandedAdvisory, setExpandedAdvisory] = useState<string | null>(null);

  const handleDismissAdvisory = (id: string) => {
    setDismissedAdvisories((prev) => [...prev, id]);
  };

  // --- Smart Action Buttons State ---
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [actionRecommendation, setActionRecommendation] = useState<ActionRecommendation | null>(null);

  // --- AI Chat Assistant State ---
  const [query, setQuery] = useState<string>('');
  const [asking, setAsking] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [voiceOutputActive, setVoiceOutputActive] = useState<boolean>(false);
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: 'welcome-1',
      sender: 'ai',
      text: MULTILINGUAL_UI[language]?.welcome || MULTILINGUAL_UI['en'].welcome,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      provider: 'Live Stadium AI',
      grounded: true,
      liked: null
    }
  ]);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // --- Fetch Dynamic Live Data ---
  useEffect(() => {
    let isMounted = true;
    Promise.all([
      axios.get('/api/fan/journey'),
      axios.get('/api/fan/pois'),
      axios.get('/api/fan/match'),
      axios.get('/api/fan/advisories')
    ])
      .then(([jRes, pRes, mRes, aRes]) => {
        if (!isMounted) return;
        setJourneySteps(jRes.data || []);
        setPois(pRes.data || []);
        setLiveMatch(mRes.data || null);
        setAdvisories(aRes.data || []);
      })
      .catch(() => {
        if (!isMounted) return;
        setErrorState('Automated safety failover engaged. Core stadium guidance remains fully accessible.');
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Update welcome text when language changes
  useEffect(() => {
    setMessages((prev) =>
      prev.map((m, idx) =>
        idx === 0
          ? {
              ...m,
              text: MULTILINGUAL_UI[language]?.welcome || MULTILINGUAL_UI['en'].welcome
            }
          : m
      )
    );
  }, [language]);

  // --- Auto Scroll ONLY inside Chat Container (Never scrolls page window) ---
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, asking]);

  // --- Ask Multilingual AI Concierge ---
  const handleAsk = useCallback(
    async (promptText?: string) => {
      const promptToUse = promptText || query;
      if (!promptToUse.trim() || asking) return;

      const userMsg: MessageItem = {
        id: `user-${Date.now()}`,
        sender: 'user',
        text: promptToUse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, userMsg]);
      setQuery('');
      setAsking(true);

      try {
        const response = await axios.post('/api/fan/assistant', {
          query: promptToUse,
          preferred_language: language
        });
        const aiMsg: MessageItem = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: response.data.response || 'I am ready to assist with any venue inquiries.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: 'Live Stadium AI',
          grounded: response.data.grounded !== false,
          liked: null
        };
        setMessages((prev) => [...prev, aiMsg]);
      } catch {
        const fallbackMsg: MessageItem = {
          id: `err-${Date.now()}`,
          sender: 'ai',
          text: 'Our primary AI service temporarily timed out. Please follow blue wayfinding signs or contact nearest Guest Concierge kiosk for immediate venue assistance.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          provider: 'Smart Assistance',
          grounded: true,
          liked: null
        };
        setMessages((prev) => [...prev, fallbackMsg]);
      } finally {
        setAsking(false);
      }
    },
    [query, asking, language]
  );

  // --- Execute Smart Action Button ---
  const handleExecuteAction = useCallback(async (actionType: string) => {
    setActionLoading(actionType);
    setActionRecommendation(null);
    try {
      const res = await axios.post('/api/fan/action', { action_type: actionType });
      if (res.data && res.data.recommendation) {
        setActionRecommendation(res.data.recommendation);
      }
    } catch {
      setActionRecommendation({
        title: 'Immediate Venue Assistance',
        route: 'Proceed to the nearest Guest Concierge Desk on Level 1.',
        estimated_time_mins: 1,
        walking_distance_m: 85,
        crowd_level: 'Low',
        accessibility: 'ADA Certified',
        target_zone: 'Main Concourse',
        confidence: '95.0%'
      });
    } finally {
      setActionLoading(null);
    }
  }, []);

  // --- Copy Message Content ---
  const handleCopy = useCallback((id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  // --- Message Feedback Thumbs Up / Down ---
  const handleLikeMessage = useCallback((id: string, isLiked: boolean) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, liked: msg.liked === isLiked ? null : isLiked } : msg))
    );
  }, []);

  // --- Toggle Favorite POI ---
  const toggleFavorite = useCallback((id: number) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  // --- Simulated Speech Recognition ---
  const toggleRecording = useCallback(() => {
    if (isRecording) {
      setIsRecording(false);
    } else {
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        setQuery('Where is the nearest ADA accessible restroom near Section 114?');
      }, 2500);
    }
  }, [isRecording]);

  // --- Filtered POIs ---
  const filteredPOIs = useMemo(() => {
    if (activeCategory === 'ALL') return pois;
    return pois.filter((p) => p.category === activeCategory);
  }, [pois, activeCategory]);

  const categoriesAvailable = useMemo(() => {
    const cats = new Set(pois.map((p) => p.category));
    return ['ALL', ...Array.from(cats)];
  }, [pois]);

  const activeAdvisories = useMemo(
    () => advisories.filter((a) => !dismissedAdvisories.includes(a.id)),
    [advisories, dismissedAdvisories]
  );

  const currentUI = MULTILINGUAL_UI[language] || MULTILINGUAL_UI['en'];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-cyan-500/30">
      {/* Dynamic Ambient Glow Gradients */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[15%] w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[160px] animate-pulse [animation-delay:2s]" />
      </div>

      {/* MAIN FAN PORTAL CONTENT */}
      <PageContainer className="relative z-10 w-full">
        <div className="flex flex-col xl:flex-row gap-6 items-start">
          
          {/* LEFT MAIN COLUMN */}
          <div className="flex-1 w-full space-y-6 min-w-0">
        {/* Error Safety Failover Banner */}
        {errorState && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="text-sm text-amber-200">{errorState}</span>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold">● {translate('SMART ASSISTANCE READY')}</span>
          </motion.div>
        )}

        {/* PHASE 3 — LIVE MATCH & TOURNAMENT TELEMETRY CARD */}
        <section aria-label="Live Match Status">
          {loading ? (
            <div className="h-56 rounded-3xl bg-slate-900/60 border border-slate-800 animate-pulse" />
          ) : liveMatch ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 md:p-8 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase tracking-wider flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                      {translate('Tournament Live')} • {liveMatch.minute}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-slate-800 text-slate-300 border border-slate-700">
                      {liveMatch.stadium}
                    </span>
                  </div>
                  <h1 className="text-2xl md:text-4xl font-black text-white tracking-tight">
                    {liveMatch.home_team} <span className="text-cyan-400 font-light">{translate('vs')}</span> {liveMatch.away_team}
                  </h1>
                  <p className="text-sm text-slate-400">{liveMatch.event_name}</p>

                  {liveMatch.ai_prediction && (
                    <div className="flex items-center gap-2 text-xs text-cyan-300 bg-cyan-950/40 border border-cyan-800/60 px-3 py-1.5 rounded-xl w-fit">
                      <TrendingUp className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>{liveMatch.ai_prediction}</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-6 md:gap-10">
                  <div className="text-center md:text-right">
                    <span className="text-xs font-mono uppercase text-slate-400 block">{translate('Live Score')}</span>
                    <span className="text-4xl md:text-5xl font-black text-emerald-400 tracking-tight">
                      {liveMatch.score}
                    </span>
                  </div>

                  <div className="h-12 w-px bg-slate-800 hidden md:block" />

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-slate-500 block">{translate('Attendance')}</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-cyan-400" />
                        {liveMatch.attendance.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{translate('Weather')}</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                        {liveMatch.weather}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{translate('Possession')}</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Award className="w-3.5 h-3.5 text-purple-400" />
                        {liveMatch.possession || '50% — 50%'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{translate('Crowd Flow')}</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-emerald-400" />
                        {liveMatch.crowd_density || 'Optimal'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{translate('Security')}</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
                        {liveMatch.security_level || 'SECURE'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-500 block">{translate('Est. Egress')}</span>
                      <span className="font-bold text-white flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-yellow-400" />
                        {liveMatch.estimated_exit_congestion || '< 5 min'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 text-center">
              <p className="text-slate-400">{translate('Match telemetry ready for active tournament events.')}</p>
            </div>
          )}
        </section>

        {/* PHASE 8 — SMART ACTION BUTTONS WITH LIVE RECOMMENDATIONS */}
        <section aria-label="One-Touch Smart Routing" className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">{translate('One-Touch Smart Routing')}</h2>
            <p className="text-xs text-slate-400">
              {translate('Instant barrier-free pathways calculated dynamically by Live Stadium AI')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleExecuteAction('ADA_ROUTE')}
              disabled={actionLoading === 'ADA_ROUTE'}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0">
                  <Accessibility className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-cyan-400 transition-colors">
                    ADA Accessible Route
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Step-free elevators & dedicated volunteer assist
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-cyan-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </button>

            <button
              onClick={() => handleExecuteAction('RESTROOM')}
              disabled={actionLoading === 'RESTROOM'}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-emerald-400 transition-colors">
                    Nearest Restroom
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Live queue monitoring & zero-wait ADA block
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </button>

            <button
              onClick={() => handleExecuteAction('FOOD')}
              disabled={actionLoading === 'FOOD'}
              className="p-5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 text-left transition-all group flex items-start justify-between"
            >
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
                  <Utensils className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <span className="text-sm font-bold text-white block group-hover:text-amber-400 transition-colors">
                    Food & Beverages
                  </span>
                  <span className="text-xs text-slate-400 block mt-0.5">
                    Shortest concession queues & mobile pickup bays
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
            </button>
          </div>

          {/* Smart Recommendation Card Panel */}
          <AnimatePresence>
            {actionRecommendation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="p-5 rounded-2xl bg-slate-900 border border-cyan-500/40 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div className="flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-cyan-400" />
                    <h3 className="text-base font-bold text-white">{actionRecommendation.title}</h3>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {translate('Est. Time')}: {actionRecommendation.estimated_time_mins} {translate('min')} ({actionRecommendation.walking_distance_m}m)
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {translate('Confidence')}: {actionRecommendation.confidence}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-3">{actionRecommendation.route}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800 text-xs text-slate-400">
                  <span>{translate('Crowd Density')}: {actionRecommendation.crowd_level || translate('Low')}</span>
                  <span>{translate('Accessibility')}: {actionRecommendation.accessibility || translate('ADA Certified')}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* PHASE 5 & 6 — CHATGPT-STYLE AI STADIUM CONCIERGE */}
        <section aria-label="AI Stadium Concierge">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-2xl flex flex-col h-[580px]">
            {/* Chat Header */}
            <div className="p-4 px-6 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center">
                  <Brain className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-white">{translate('AI Stadium Concierge')}</h2>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setVoiceOutputActive(!voiceOutputActive)}
                  className={`p-2 rounded-xl border transition-colors ${
                    voiceOutputActive
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-400'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={translate('Voice Output Audio')}
                >
                  {voiceOutputActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Suggested Prompts Bar */}
            <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/60 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono uppercase text-slate-500 shrink-0">
                {currentUI.suggestionsTitle}:
              </span>
              {[
                translate('Where is my nearest accessible entry?'),
                translate('What is the concession queue at Gate 4?'),
                translate('Where can I find EV charging spaces?'),
                translate('Where is First Aid Level 1?')
              ].map((sug) => (
                <button
                  key={sug}
                  onClick={() => handleAsk(sug)}
                  disabled={asking}
                  className="px-3 py-1 rounded-full bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition-colors shrink-0"
                >
                  {sug}
                </button>
              ))}
            </div>

            {/* Conversation Bubbles Container */}
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[480px]">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-[72%] p-4 rounded-2xl ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-lg'
                        : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none shadow-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>

                    <div className="flex items-center justify-end gap-3 mt-2.5 text-[10px] opacity-70">
                      <span>{msg.timestamp}</span>
                      {msg.sender === 'ai' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleCopy(msg.id, msg.text)}
                            className="hover:text-white transition-colors flex items-center gap-1"
                            title={translate('Copy response')}
                          >
                            {copiedId === msg.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span className="text-emerald-400">{translate('Copied')}</span>
                              </>
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                          <button
                            onClick={() => handleLikeMessage(msg.id, true)}
                            className={`hover:text-white transition-colors ${msg.liked === true ? 'text-emerald-400' : ''}`}
                            title={translate('Helpful response')}
                          >
                            <ThumbsUp className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleLikeMessage(msg.id, false)}
                            className={`hover:text-white transition-colors ${msg.liked === false ? 'text-rose-400' : ''}`}
                            title={translate('Needs improvement')}
                          >
                            <ThumbsDown className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleAsk(messages.slice(-2, -1)[0]?.text || translate('Help me'))}
                            className="hover:text-white transition-colors flex items-center gap-1"
                            title={translate('Regenerate response')}
                          >
                            <RefreshCw className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {asking && (
                <div className="flex items-start">
                  <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl rounded-bl-none flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            {/* Input Footer */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAsk();
              }}
              className="p-4 px-6 bg-slate-950/90 border-t border-slate-800"
            >
              <div className="flex items-center gap-2">
                <button
                  onClick={toggleRecording}
                  type="button"
                  aria-label={translate('Toggle speech input')}
                  className={`p-3 rounded-xl border transition-all ${
                    isRecording
                      ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                  title={translate('Speech input')}
                >
                  {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </button>

                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAsk();
                    }
                  }}
                  placeholder={currentUI.askPlaceholder}
                  aria-label={translate('Ask the AI Stadium Concierge')}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />

                <button
                  type="submit"
                  disabled={asking || !query.trim()}
                  aria-label={translate('Send query')}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-white font-bold text-sm flex items-center gap-2 shadow-lg shadow-cyan-500/20 transition-all"
                >
                  <span>{translate('Send')}</span>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* PHASE 10 — INTERACTIVE 12-STAGE FAN JOURNEY TIMELINE */}
        <section aria-label="Interactive 12-Stage Fan Journey Timeline">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">{translate('Interactive 12-Stage Fan Journey')}</h2>
                <p className="text-xs text-slate-400">
                  {translate('Select any stage to view live synchronized recommendations and venue SLAs')}
                </p>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                  <div key={i} className="h-24 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {journeySteps.map((step) => {
                  const icon = STEP_ICONS[step.step_name] || '📍';
                  const isSelected = activeStepName === step.step_name;

                  return (
                    <button
                      key={step.step_name}
                      onClick={() => setActiveStepName(step.step_name)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-950 border-slate-800/80 hover:border-slate-700'
                      }`}
                    >
                      <span className="text-2xl block mb-1.5">{icon}</span>
                      <span className="text-xs font-bold text-white block truncate">{step.step_name}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">{step.est_completion || translate('Ready')}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Active Stage Detailed View */}
            {activeStepName && (
              <motion.div
                key={activeStepName}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <span className="text-xs font-mono uppercase text-cyan-400 font-bold">
                    {translate('ACTIVE STAGE TELEMETRY')}
                  </span>
                  <h3 className="text-lg font-bold text-white">{activeStepName} {translate('GUIDANCE')}</h3>
                  <p className="text-sm text-slate-300">
                    {journeySteps.find((j) => j.step_name === activeStepName)?.description ||
                      translate('Predictive AI wayfinding and synchronized venue recommendations.')}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-emerald-400 font-bold">
                    ● {translate('SLA ACTIVE')}
                  </span>
                </div>
              </motion.div>
            )}
          </div>
        </section>

        {/* PHASE 9 — DYNAMIC POINTS OF INTEREST (LIVE FROM SUPABASE DB) */}
        <section aria-label="Verified Venue Points of Interest">
          <div className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-white tracking-tight">Verified Venue Points of Interest</h2>
                <p className="text-xs text-slate-400">
                  Venue Telemetry & Synchronized Operations
                </p>
              </div>

              {/* Category Filter Pills */}
              <div className="flex flex-wrap items-center gap-1.5">
                {categoriesAvailable.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      activeCategory === cat
                        ? 'bg-cyan-500 text-slate-950 border-cyan-400 shadow-md'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-32 rounded-2xl bg-slate-950 border border-slate-800 animate-pulse" />
                ))}
              </div>
            ) : filteredPOIs.length === 0 ? (
              <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400">
                {translate('No active points of interest found in this category.')}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPOIs.map((poi) => {
                  const meta = CATEGORY_META[poi.category] || {
                    label: poi.category,
                    icon: MapPin,
                    colorClass: 'text-slate-300',
                    bgClass: 'bg-slate-800 border-slate-700'
                  };
                  const IconComponent = meta.icon;
                  const isFav = favorites.includes(poi.id);

                  return (
                    <div
                      key={poi.id}
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between gap-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${meta.bgClass} border flex items-center justify-center shrink-0`}>
                            <IconComponent className={`w-5 h-5 ${meta.colorClass}`} />
                          </div>
                          <div>
                            <span className={`text-[11px] font-mono font-bold uppercase ${meta.colorClass}`}>
                              {poi.category}
                            </span>
                            <h3 className="text-sm font-bold text-white mt-0.5">{poi.name}</h3>
                          </div>
                        </div>

                        <button
                          onClick={() => toggleFavorite(poi.id)}
                          className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                          title="Save to Favorites"
                        >
                          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
                        <div className="flex items-center gap-2 text-slate-400">
                          <span>{poi.distance_m || 150}m</span>
                          <span>•</span>
                          <span>{poi.walking_time_mins || 3} min walk</span>
                        </div>

                        <div className="flex items-center gap-2">
                          {poi.accessibility_equipped && (
                            <span
                              className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-[10px] font-mono font-bold"
                              title="ADA Accessible"
                            >
                              ♿ ADA
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-[10px] font-mono font-bold">
                            {poi.status || 'OPEN'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
          </div>
          
          {/* RIGHT SIDEBAR — LIVE AI ALERT CENTER */}
          <aside className="w-full xl:w-[380px] shrink-0 sticky top-24 space-y-6">
            <section aria-label="AI Alert Center" className="rounded-3xl bg-slate-900/80 border border-slate-800 p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-base font-bold uppercase tracking-wider text-slate-200">{translate('Live AI Alert Center')}</h2>
                </div>
                <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
                  {activeAdvisories.length} {translate('ALERTS')}
                </span>
              </div>

              <div className="flex flex-col gap-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                {activeAdvisories.map((adv) => {
                  const isExpanded = expandedAdvisory === adv.id;
                  return (
                    <motion.div
                      key={adv.id}
                      layout
                      className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between gap-3 shadow-md"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-slate-200">{adv.badge}</span>
                          <span className="text-[10px] font-mono text-slate-500">{adv.timestamp}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug">{adv.title}</h3>
                        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">{adv.message}</p>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 space-y-1.5 font-mono overflow-hidden"
                            >
                              <div className="flex justify-between">
                                <span className="text-slate-500">{translate('Zone:')}</span>
                                <span className="font-semibold text-white">{adv.target_zone}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500">{translate('Status:')}</span>
                                <span className="text-cyan-400">{translate('AI Active')}</span>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-2 pt-2 border-t border-slate-800/50">
                        <button
                          onClick={() => setExpandedAdvisory(isExpanded ? null : adv.id)}
                          className="text-[10px] font-bold text-cyan-500 hover:text-cyan-400 uppercase flex items-center gap-1 transition-colors"
                        >
                          {isExpanded ? translate('Collapse') : translate('Details')}
                          <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                        </button>
                        <button
                          onClick={() => handleDismissAdvisory(adv.id)}
                          className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] font-bold text-slate-300 transition-colors"
                        >
                          {translate('DISMISS')}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
                {activeAdvisories.length === 0 && (
                  <div className="p-6 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-2xl">
                    {translate('No active stadium advisories')}
                  </div>
                )}
              </div>
            </section>
          </aside>
          
        </div>
      </PageContainer>
    </div>
  );
}
