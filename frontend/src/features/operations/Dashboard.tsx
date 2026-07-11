import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Incident {
  id: number;
  severity: string;
  status: string;
  zone_id: number;
}

const OperationsDashboard: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);

  useEffect(() => {
    // Fetch incidents
    axios.get('/api/ops/incidents').then(res => {
      setIncidents(res.data);
    }).catch(console.error);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Operations Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Live Incident Feed</h2>
          <ul>
            {incidents.map(inc => (
              <li key={inc.id} className="mb-2 p-2 bg-gray-100 rounded">
                Incident #{inc.id} - {inc.severity} - {inc.status}
              </li>
            ))}
            {incidents.length === 0 && <li>No active incidents.</li>}
          </ul>
        </div>
        <div className="border p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Recommendation Panel</h2>
          <p className="text-gray-500">Awaiting AI insights...</p>
        </div>
      </div>
    </div>
  );
};

export default OperationsDashboard;
