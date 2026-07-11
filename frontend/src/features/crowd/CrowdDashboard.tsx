import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface CrowdZone {
  id: number;
  name: string;
  max_capacity: number;
}

const CrowdDashboard: React.FC = () => {
  const [zones, setZones] = useState<CrowdZone[]>([]);
  const [globalOccupancy, setGlobalOccupancy] = useState(0);

  useEffect(() => {
    axios.get('/api/crowd/zones').then(res => setZones(res.data)).catch(console.error);
    axios.get('/api/crowd/dashboard').then(res => setGlobalOccupancy(res.data.total_stadium_occupancy)).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Crowd Intelligence Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2 border p-4 rounded shadow bg-slate-50">
          <h2 className="text-xl font-semibold mb-2">Stadium Heatmap (Simulation)</h2>
          <div className="h-64 bg-gray-300 flex items-center justify-center rounded">
             {/* Map Integration Placeholder */}
             <span className="text-gray-500">Live Heatmap Overlay...</span>
          </div>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">KPIs</h2>
          <p className="text-lg">Total Occupancy: <span className="font-bold">{globalOccupancy}</span></p>
          <h3 className="text-lg font-semibold mt-4 mb-2">Zone Status</h3>
          <ul>
            {zones.map(z => (
              <li key={z.id} className="mb-1 text-sm bg-blue-100 p-1 rounded">
                {z.name} (Max: {z.max_capacity})
              </li>
            ))}
            {zones.length === 0 && <li className="text-sm">No zones initialized.</li>}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CrowdDashboard;
