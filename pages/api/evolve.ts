import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface SubscriptionInfo {
  plan: string;
  entitlements: Record<string, any>;
  stripe_customer_id?: string;
}

export default function Evolve() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState<File | null>(null);
  const [metrics, setMetrics] = useState<any | null>(null);
  const [scenarioList, setScenarioList] = useState<any[]>([]);
  const [analysisError, setAnalysisError] = useState<string>('');

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

  // Load scenarios once entitlements loaded
  useEffect(() => {
    async function loadScenarios() {
      try {
        const res = await fetch('/api/scenarios');
        const data = await res.json();
        setScenarioList(data);
      } catch (err) {
        console.error('Failed to load scenarios', err);
      }
    }
    if (subInfo?.entitlements?.evolve) {
      loadScenarios();
    }
  }, [subInfo]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
    setMetrics(null);
    setAnalysisError('');
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setAnalysisError('');
    try {
      const text = await file.text();
      // Parse CSV: assume each line is a profit/loss number separated by comma or newline
      const values: number[] = [];
      text.split(/\r?\n/).forEach((line) => {
        line.split(/[ ,]+/).forEach((token) => {
          const num = parseFloat(token);
          if (!isNaN(num)) values.push(num);
        });
      });
      if (values.length === 0) {
        setAnalysisError('No numeric values found in file');
        return;
      }
      const res = await fetch('/api/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades: values }),
      });
      const data = await res.json();
      if (res.ok) {
        setMetrics(data);
      } else {
        setAnalysisError(data.error || 'Analysis failed');
      }
    } catch (err: any) {
      setAnalysisError(err.message);
    }
  };

  if (authLoading || loading) {
    return <div className="min-h-screen p-8">Loading…</div>;
  }
  if (!subInfo?.entitlements?.evolve) {
    return <div className="min-h-screen p-8">Evolve is not available for your plan.</div>;
  }
  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Evolve</h1>
      <p className="text-gray-300">Upload your backtest results (.csv or .txt) to compute performance metrics and receive scenario drills.</p>
      <div className="space-y-4 max-w-md">
        <input type="file" accept=".csv,.txt" onChange={handleFileChange} className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-edge-gold file:text-black" />
        <button onClick={handleAnalyze} className="edge-btn" disabled={!file}>Analyze</button>
        {analysisError && <p className="text-red-400">{analysisError}</p>}
      </div>
      {metrics && (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold">Metrics</h2>
          <ul className="text-left space-y-1">
            <li>Win Rate: {(metrics.winRate * 100).toFixed(2)}%</li>
            <li>Profit Factor: {metrics.profitFactor ? metrics.profitFactor.toFixed(2) : 'N/A'}</li>
            <li>Max Drawdown: {metrics.maxDrawdown.toFixed(2)}</li>
            <li>Sharpe Ratio: {metrics.sharpe ? metrics.sharpe.toFixed(2) : 'N/A'}</li>
            <li>Sortino Ratio: {metrics.sortino ? metrics.sortino.toFixed(2) : 'N/A'}</li>
          </ul>
        </div>
      )}
      {scenarioList.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-2xl font-semibold">Scenario Drills</h2>
          <ul className="space-y-4">
            {scenarioList.map((sc) => (
              <li key={sc.id} className="edge-card space-y-2">
                <h3 className="text-xl font-bold">{sc.title}</h3>
                <p>{sc.description}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
