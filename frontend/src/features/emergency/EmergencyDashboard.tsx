import React, { useState } from 'react';
import axios from 'axios';

const EmergencyDashboard: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);

  const handleQuery = () => {
    axios.post('/api/knowledge/query', { question: query })
      .then(res => setResponse(res.data.ai_answer))
      .catch(console.error);
  };

  const handleEvacuate = () => {
    if (window.confirm("CRITICAL: Trigger Stadium Evacuation?")) {
      axios.post('/api/emergency/evacuations').then(() => alert("Evacuation Triggered!"));
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto bg-red-50 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b-4 border-red-600 pb-4">
        <h1 className="text-3xl font-extrabold text-red-700">Emergency Command Center</h1>
        <button onClick={handleEvacuate} className="bg-red-700 hover:bg-red-800 text-white font-bold py-2 px-6 rounded shadow-lg animate-pulse">
          TRIGGER EVACUATION
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow border border-red-200">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-red-900">Active Incidents (Triage)</h2>
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
            <p className="font-bold">CODE RED - Medical Emergency</p>
            <p>Zone 12 - First Responders Dispatched</p>
          </div>
          <p className="text-gray-500 text-sm italic">Waiting for live WebSocket feed...</p>
        </div>
        
        <div className="bg-white p-4 rounded shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-4 border-b pb-2 text-gray-800">Knowledge Assistant (RAG)</h2>
          <div className="mb-4">
            <input 
              type="text" 
              className="w-full border p-2 rounded" 
              placeholder="e.g. Protocol for severe weather?"
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
            <button onClick={handleQuery} className="mt-2 bg-blue-600 text-white px-4 py-2 rounded">Ask Assistant</button>
          </div>
          {response && (
            <div className="p-4 bg-blue-50 border-l-4 border-blue-500">
              <p className="font-semibold text-blue-900">AI Response:</p>
              <p className="text-blue-800">{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyDashboard;
