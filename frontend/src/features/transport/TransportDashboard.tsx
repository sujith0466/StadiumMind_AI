import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface SustainabilityMetric {
  total_carbon_offset_kg: number;
  renewable_energy_percentage: number;
  water_usage_liters: number;
  recycling_rate_percentage: number;
  waste_diversion_percentage: number;
  energy_cost_savings_usd: number;
}

const TransportDashboard: React.FC = () => {
  const [metrics, setMetrics] = useState<SustainabilityMetric | null>(null);

  useEffect(() => {
    axios.get('/api/sustainability/metrics').then(res => setMetrics(res.data)).catch(console.error);
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-green-900">Transport & Sustainability Intelligence</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded shadow border-l-4 border-green-500">
          <h2 className="text-sm font-semibold text-gray-500">CO₂ Saved (kg)</h2>
          <p className="text-2xl font-bold">{metrics?.total_carbon_offset_kg || 0}</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-l-4 border-yellow-500">
          <h2 className="text-sm font-semibold text-gray-500">Renewable Energy</h2>
          <p className="text-2xl font-bold">{metrics?.renewable_energy_percentage || 0}%</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-l-4 border-blue-500">
          <h2 className="text-sm font-semibold text-gray-500">Water Usage (L)</h2>
          <p className="text-2xl font-bold">{metrics?.water_usage_liters || 0}</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-l-4 border-teal-500">
          <h2 className="text-sm font-semibold text-gray-500">Recycling Rate</h2>
          <p className="text-2xl font-bold">{metrics?.recycling_rate_percentage || 0}%</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-l-4 border-orange-500">
          <h2 className="text-sm font-semibold text-gray-500">Waste Diversion</h2>
          <p className="text-2xl font-bold">{metrics?.waste_diversion_percentage || 0}%</p>
        </div>
        <div className="p-4 bg-white rounded shadow border-l-4 border-emerald-600">
          <h2 className="text-sm font-semibold text-gray-500">Energy Cost Savings</h2>
          <p className="text-2xl font-bold">${metrics?.energy_cost_savings_usd || 0}</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Smart Parking Overview</h2>
          <p className="text-gray-500 text-sm">Parking map loading...</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-4 border-b pb-2">Fan Transport Recommender</h2>
          <div className="p-4 bg-gray-50 rounded border border-dashed border-gray-300">
            <p className="text-sm text-gray-700 font-mono">
              [AI] Best Entrance: Gate 4 <br/>
              [AI] Shuttle: ADA Shuttle 2 <br/>
              [AI] Est. Walk Time: 5 mins
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransportDashboard;
