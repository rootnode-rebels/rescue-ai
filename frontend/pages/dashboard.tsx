import useSWR from 'swr';
import { useEffect } from 'react';

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || 'http://localhost:8000';
const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function Dashboard() {
  const { data, mutate } = useSWR(`${BACKEND}/api/v1/sos?status=pending&limit=50`, fetcher, { refreshInterval: 3000 });

  useEffect(() => {
    // simple polling for demo
    const t = setInterval(() => mutate(), 5000);
    return () => clearInterval(t);
  }, [mutate]);

  if (!data) return <div className="p-6">Loading...</div>;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rescue Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white p-4 rounded shadow">
          <h2 className="font-semibold mb-2">SOS Queue</h2>
          <ul>
            {data.map((s: any) => (
              <li key={s.id} className="border p-3 mb-2 rounded">
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium">{s.priority_label?.toUpperCase() || 'PENDING'} • {Math.round(s.priority_score || 0)}</div>
                    <div className="text-sm text-slate-600">{s.description}</div>
                    <div className="text-xs mt-2">
                      Reasons: {(s.reasons || []).slice(0,3).join(', ')}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">Confidence: {(s.confidence||0).toFixed(2)}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-slate-500">{s.location?.lat?.toFixed?.(3)},{s.location?.lng?.toFixed?.(3)}</div>
                    <button className="bg-blue-600 text-white px-3 py-1 rounded mt-3" onClick={async () => {
                      await fetch(`${BACKEND}/api/v1/sos/${s.id}/accept`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({team_id: 'demo', officer_id: 'demo'}) });
                      mutate();
                    }}>Accept</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-semibold">Map</h2>
          <div className="h-96 bg-slate-100 flex items-center justify-center text-slate-400">
            Map placeholder — add Google Maps key and map component for production
          </div>
        </div>
      </div>
    </div>
  );
}
