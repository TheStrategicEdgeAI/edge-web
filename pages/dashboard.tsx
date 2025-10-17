import React, { useEffect, useState } from 'react';

interface Module {
  id: number;
  slug: string;
  name: string;
  tier: string;
}

export default function Dashboard() {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://edge-api.onrender.com';

  useEffect(() => {
    async function loadModules() {
      try {
        const res = await fetch(`${apiUrl}/modules`);
        const data = await res.json();
        setModules(data);
      } catch (error) {
        console.error('Failed to load modules', error);
      } finally {
        setLoading(false);
      }
    }
    loadModules();
  }, [apiUrl]);

  return (
    <div className="min-h-screen p-8 text-center">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Dashboard</h1>
      {loading ? (
        <p>Loading modules…</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((mod) => (
            <div key={mod.id} className="edge-card">
              <h2 className="text-xl font-semibold mb-2">{mod.name}</h2>
              <p className="text-sm uppercase mb-4">Tier: {mod.tier}</p>
              <a
                href={`/mastery/${mod.slug}`}
                className="edge-btn secondary"
              >
                View lessons
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
