import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface AccessibilityMetrics {
  avg_response_time: number;
  volunteer_utilization: number;
  translation_success_rate: number;
  route_success_rate: number;
}

const VolunteerDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<AccessibilityMetrics | null>(null);

  useEffect(() => {
    axios.get('/api/accessibility/analytics').then(res => setMetrics(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-indigo-900">Volunteer & Accessibility Intelligence</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow border-t-4 border-blue-500">
          <h2 className="text-sm font-semibold text-gray-500">Avg Response Time</h2>
          <p className="text-2xl font-bold">{metrics?.avg_response_time || 0}s</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-t-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-500">Volunteer Utilization</h2>
          <p className="text-2xl font-bold">{(metrics?.volunteer_utilization || 0) * 100}%</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-t-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500">Translation Success</h2>
          <p className="text-2xl font-bold">{(metrics?.translation_success_rate || 0) * 100}%</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-t-4 border-purple-500">
          <h2 className="text-sm font-semibold text-gray-500">Route Success</h2>
          <p className="text-2xl font-bold">{(metrics?.route_success_rate || 0) * 100}%</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Active Task Queue</h2>
          <p className="text-gray-500 text-sm">Waiting for live WebSocket feed...</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Live Assistance (Map)</h2>
          <div className="h-48 bg-slate-100 flex items-center justify-center rounded">
            <span className="text-gray-400">Map Overlay Disabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VolunteerDashboard;
