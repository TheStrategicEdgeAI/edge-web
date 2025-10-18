import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

/**
 * Design Assistant page
 *
 * This page allows paid users to craft a trading strategy using only
 * approved indicators. It follows the same entitlement checks and
 * subscription loading pattern used on the Evaluate and Generate pages.
 *
 * Users enter a comma‑separated list of indicators and a timeframe. The
 * indicators are first validated via the `/api/design-validate` proxy.
 * Once validated, the page submits the request to `/api/design` and
 * displays the conceptual strategy returned by the backend.
 */
export default function Design() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [indicatorInput, setIndicatorInput] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const [strategy, setStrategy] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Load subscription and entitlements on mount
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

  /**
   * Validate the list of indicators by calling the proxy. The API expects
   * `indicators` as an array of strings. On error, store the error
   * message; otherwise return true.
   */
  async function validateIndicators(): Promise<boolean> {
    const indicators = indicatorInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (indicators.length === 0) {
      setValidationError('Please specify at least one indicator.');
      return false;
    }
    try {
      const resp = await fetch('/api/design-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicators }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setValidationError(data.error || 'Indicator validation failed');
        return false;
      }
      setValidationError(null);
      return true;
    } catch (err) {
      setValidationError('Validation request failed');
      return false;
    }
  }

  /**
   * Submit the design request to the backend. If indicators have not yet
   * been validated, this triggers validation first.
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Ensure indicators are validated
    if (!(await validateIndicators())) return;
    setSubmitting(true);
    setStrategy(null);
    try {
      const resp = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicator: indicatorInput, timeframe, userId: user?.id }),
      });
      const data = await resp.json();
      if (!resp.ok) {
        setValidationError(data.error || 'Design request failed');
        return;
      }
      // The backend returns a description string; fall back to serialising the data
      setStrategy(data.description || data.strategy || JSON.stringify(data));
    } catch (err) {
      setValidationError('Design request failed');
    } finally {
      setSubmitting(false);
    }
  }

  if (authLoading || loading) {
    return <div className="min-h-screen p-8">Loading…</div>;
  }
  if (!subInfo?.entitlements?.design) {
    return <div className="min-h-screen p-8">Design assistant is not available for your plan.</div>;
  }

  return (
    <div className="min-h-screen p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Design Assistant</h1>
      <p className="mb-6">Create a conceptual trading strategy by selecting approved indicators and a timeframe.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Indicators (comma separated)</label>
          <input
            type="text"
            value={indicatorInput}
            onChange={(e) => setIndicatorInput(e.target.value)}
            placeholder="SMA, RSI, VWMA"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Timeframe</label>
          <input
            type="text"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            placeholder="1h, 1d, etc."
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
        </div>
        {validationError && <p className="text-red-500">{validationError}</p>}
        <button type="submit" className="edge-btn" disabled={submitting}>
          {submitting ? 'Designing…' : 'Generate Concept'}
        </button>
      </form>
      {strategy && (
        <div className="mt-8 p-4 border border-gray-700 rounded-md bg-gray-900">
          <h2 className="font-semibold mb-2">Strategy Concept</h2>
          <p>{strategy}</p>
        </div>
      )}
    </div>
  );
}