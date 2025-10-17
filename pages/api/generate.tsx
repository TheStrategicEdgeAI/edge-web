import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface SubscriptionInfo {
  plan: string;
  entitlements: Record<string, any>;
  stripe_customer_id?: string;
}

export default function Generate() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [platform, setPlatform] = useState<'ninja' | 'pine'>('ninja');
  const [indicator, setIndicator] = useState('SMA');
  const [timeframe, setTimeframe] = useState('Daily');
  const [script, setScript] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    async function loadEntitlements() {
      if (!user) return;
      try {
        const res = await fetch(`/api/subscription?userId=${encodeURIComponent(user.id)}`);
        const data = await res.json();
        setSubInfo(data);
      } finally {
        setLoading(false);
      }
    }
    if (!authLoading) {
      if (user) {
        loadEntitlements();
      } else {
        router.push('/login');
      }
    }
  }, [user, authLoading, router]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    setError('');
    setScript(null);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include userId to enforce usage limits
        body: JSON.stringify({ platform, indicator, timeframe, userId: user?.id }),
      });
      const data = await res.json();
      if (res.ok) {
        setScript(data.script);
      } else {
        setError(data.error || 'Generation failed');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen p-8">Loading…</div>;
  }
  if (!subInfo?.entitlements?.generate) {
    return <div className="min-h-screen p-8">Generate is not available for your plan.</div>;
  }
  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Generate</h1>
      <form onSubmit={handleGenerate} className="space-y-4 max-w-md">
        <div className="space-y-2">
          <label className="block font-semibold">Platform</label>
          <select value={platform} onChange={(e) => setPlatform(e.target.value as 'ninja' | 'pine')} className="w-full p-2 rounded-md bg-gray-800 text-white">
            <option value="ninja">NinjaScript</option>
            <option value="pine">Pine Script</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">Indicator</label>
          <input type="text" value={indicator} onChange={(e) => setIndicator(e.target.value)} className="w-full p-2 rounded-md bg-gray-800 text-white" placeholder="e.g., SMA" />
        </div>
        <div className="space-y-2">
          <label className="block font-semibold">Timeframe</label>
          <input type="text" value={timeframe} onChange={(e) => setTimeframe(e.target.value)} className="w-full p-2 rounded-md bg-gray-800 text-white" placeholder="e.g., Daily" />
        </div>
        <button type="submit" className="edge-btn" disabled={generating}> {generating ? 'Generating…' : 'Generate Strategy'} </button>
        {error && <p className="text-red-400">{error}</p>}
      </form>
      {script && (
        <div className="mt-6 max-w-full overflow-x-auto">
          <h2 className="text-2xl font-semibold mb-2">Generated Script</h2>
          <pre className="bg-gray-800 text-gray-200 p-4 rounded-md whitespace-pre-wrap text-sm">
            {script}
          </pre>
        </div>
      )}
    </div>
  );
}
