import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface FanJourneyStep {
  step_name: string;
  mapped_intelligence_module: string;
  description: string;
}

const FanPortal: React.FC = () => {
  const [journeySteps, setJourneySteps] = useState<FanJourneyStep[]>([]);
  const [query, setQuery] = useState('');
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    axios.get('/api/fan/journey')
      .then(res => setJourneySteps(res.data))
      .catch(console.error);
  }, []);

  const handleAskAssistant = () => {
    axios.post('/api/fan/assistant', { query, preferred_language: language })
      .then(res => setAiResponse(res.data.response))
      .catch(console.error);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-slate-900 text-white min-h-screen">
      {/* Header & Offline Indicator */}
      <div className="flex justify-between items-center border-b border-slate-700 pb-4 mb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-cyan-400">StadiumMind AI Fan Portal</h1>
          <p className="text-sm text-slate-400">Smart Stadium Navigation & Multilingual Assistant</p>
        </div>
        <div className="flex items-center space-x-4">
          <span className="bg-emerald-600 text-xs px-2 py-1 rounded font-semibold">OFFLINE CACHE READY</span>
          <select 
            value={language} 
            onChange={e => setLanguage(e.target.value)}
            className="bg-slate-800 border border-slate-600 rounded px-3 py-1 text-sm text-white"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      {/* Live Match & Advisories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800 p-4 rounded shadow border border-slate-700">
          <h2 className="text-sm font-bold text-slate-400 mb-1">LIVE MATCH</h2>
          <p className="text-2xl font-black text-white">Championship Finals</p>
          <p className="text-emerald-400 font-bold mt-2">Score: 2 - 1 (68')</p>
        </div>
        <div className="bg-slate-800 p-4 rounded shadow border border-slate-700 col-span-2">
          <h2 className="text-sm font-bold text-slate-400 mb-1">SMART NAVIGATION & ADVISORIES</h2>
          <p className="text-amber-400 text-sm mt-1">
            ⚠️ Advisory: Gate 2 experiencing heavy congestion. Re-routing via Gate 4 recommended.
          </p>
          <div className="mt-3 flex space-x-3">
            <button className="bg-cyan-600 hover:bg-cyan-700 text-white text-xs px-3 py-1.5 rounded font-semibold">
              ADA Accessible Route
            </button>
            <button className="bg-slate-700 hover:bg-slate-600 text-white text-xs px-3 py-1.5 rounded font-semibold">
              Find Nearest Restroom
            </button>
          </div>
        </div>
      </div>

      {/* Multilingual AI Assistant */}
      <div className="bg-slate-800 p-6 rounded shadow border border-slate-700 mb-8">
        <h2 className="text-xl font-bold text-cyan-400 mb-3">Multilingual AI Assistant</h2>
        <div className="flex space-x-2 mb-4">
          <input 
            type="text" 
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Ask anything in your preferred language..."
            className="flex-1 bg-slate-900 border border-slate-700 rounded p-2 text-white placeholder-slate-500"
          />
          <button 
            onClick={handleAskAssistant}
            className="bg-cyan-500 hover:bg-cyan-600 text-slate-950 font-bold px-6 py-2 rounded"
          >
            Ask
          </button>
        </div>
        {aiResponse && (
          <div className="p-4 bg-slate-900 border-l-4 border-cyan-400 text-sm">
            <p className="font-semibold text-cyan-300">AI Response:</p>
            <p className="text-slate-200 mt-1">{aiResponse}</p>
          </div>
        )}
      </div>

      {/* Complete Fan Journey Timeline */}
      <div className="bg-slate-800 p-6 rounded shadow border border-slate-700">
        <h2 className="text-xl font-bold text-cyan-400 mb-4">Complete Fan Journey Timeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {journeySteps.map((step, idx) => (
            <div key={idx} className="bg-slate-900 p-3 rounded border border-slate-800">
              <span className="text-xs font-mono text-cyan-400 font-bold">{step.step_name}</span>
              <p className="text-xs text-slate-400 mb-1">Module: {step.mapped_intelligence_module}</p>
              <p className="text-sm text-slate-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FanPortal;
