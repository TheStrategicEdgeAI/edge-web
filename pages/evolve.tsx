import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * Evolve Assistant page
 *
 * This page allows users to analyse their strategy performance. It asks the
 * user to paste a comma‑separated list of trade results (e.g. returns in
 * percent or profit/loss per trade) and forwards this array to the
 * `/api/evolve` proxy. The backend computes key metrics like win rate,
 * profit factor and drawdowns. We also fetch available scenario drills via
 * `/api/scenarios` and list them for future enhancements.
 */
export default function Evolve() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [tradesText, setTradesText] = useState('');
  const [metrics, setMetrics] = useState<any>(null);
  const [scenarios, setScenarios] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load subscription and entitlements
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

  // Fetch available scenario drills on mount
  useEffect(() => {
    async function fetchScenarios() {
      try {
        const res = await fetch('/api/scenarios');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) setScenarios(data);
        }
      } catch {
        // ignore errors
      }
    }
    fetchScenarios();
  }, []);

  // Parse the trades text into an array of numbers. Ignores empty strings.
  function parseTrades(text: string): number[] {
    return text
      .split(/[\n,]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => Number(s));
  }

  async function handleAnalyse(e: React.FormEvent) {
    e.preventDefault();
    const tradesArr = parseTrades(tradesText);
    if (tradesArr.some((n) => isNaN(n))) {
      setError('Please enter only numeric trade results (comma or newline separated)');
      return;
    }
    setError(null);
    setSubmitting(true);
    setMetrics(null);
    try {
      const resp = await fetch('/api/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ trades: tradesArr, userId: user?.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setError(data.error || 'Analysis failed');
        return;
      }
      setMetrics(data);
    } catch (err) {
      setError('Analysis request failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return <div className="min-h-screen p-8">Loading…</div>;
  }
  if (!subInfo?.entitlements?.evolve) {
    return <div className="min-h-screen p-8">Evolve assistant is not available for your plan.</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Evolve Assistant</h1>
      <p className="mb-6">Paste your trade results below to compute performance metrics. Each value should represent the return or profit/loss for a single trade (you can separate values with commas or newlines).</p>
      <form onSubmit={handleAnalyse} className="space-y-4">
        <textarea
          value={tradesText}
          onChange={(e) => setTradesText(e.target.value)}
          placeholder="0.03, -0.02, 0.05, …"
          className="w-full h-32 p-2 rounded-md bg-gray-800 text-white"
        />
        {error && <p className="text-red-500">{error}</p>}
        <button type="submit" className="edge-btn" disabled={submitting}>
          {submitting ? 'Analysing…' : 'Analyse Performance'}
        </button>
      </form>
      {metrics && (
        <div className="mt-8 border border-gray-700 p-4 rounded-md bg-gray-900 space-y-2">
          <h2 className="font-semibold text-xl mb-2">Performance Metrics</h2>
          <p>Win Rate: {typeof metrics.winRate === 'number' ? (metrics.winRate * 100).toFixed(1) + '%' : metrics.winRate}</p>
          <p>Profit Factor: {metrics.profitFactor?.toFixed?.(2) ?? metrics.profitFactor}</p>
          <p>Max Drawdown: {typeof metrics.maxDrawdown === 'number' ? (metrics.maxDrawdown * 100).toFixed(1) + '%' : metrics.maxDrawdown}</p>
          {metrics.sharpeRatio !== undefined && <p>Sharpe Ratio: {metrics.sharpeRatio?.toFixed?.(2) ?? metrics.sharpeRatio}</p>}
          {metrics.sortinoRatio !== undefined && <p>Sortino Ratio: {metrics.sortinoRatio?.toFixed?.(2) ?? metrics.sortinoRatio}</p>}
        </div>
      )}
      {scenarios.length > 0 && (
        <div className="mt-8 p-4 border border-gray-700 rounded-md bg-gray-900">
          <h2 className="font-semibold mb-2">Scenario Drills</h2>
          <ul className="list-disc list-inside space-y-1">
            {scenarios.map((sc) => (
              <li key={sc.id || sc.slug || sc.name}>{sc.name || sc.title || JSON.stringify(sc)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}