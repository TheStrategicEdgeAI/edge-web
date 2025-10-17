import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface SubscriptionInfo {
  plan: string;
  entitlements: Record<string, any>;
  stripe_customer_id?: string;
}

export default function Design() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  // State for design assistant form
  const [indicator, setIndicator] = useState('SMA');
  const [timeframe, setTimeframe] = useState('Daily');
  const [designDesc, setDesignDesc] = useState<string | null>(null);
  const [validationResult, setValidationResult] = useState<{ valid: boolean; invalidIndicators: string[]; suggestions: Record<string, string> } | null>(null);
  const [submitting, setSubmitting] = useState(false);

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

  if (authLoading || loading) {
    return <div className="min-h-screen p-8">Loading…</div>;
  }
  if (!subInfo?.entitlements?.design) {
    return <div className="min-h-screen p-8">Design is not available for your plan.</div>;
  }
  // Handle form submission: validate indicator then request design description
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setDesignDesc(null);
    setValidationResult(null);
    try {
      // First validate the indicator
      const validateRes = await fetch('/api/design-validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ indicators: [indicator] }),
      });
      const validateJson = await validateRes.json();
      setValidationResult(validateJson);
      if (!validateJson.valid) {
        setSubmitting(false);
        return;
      }
      // If valid, request design description
      const designRes = await fetch('/api/design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Include userId so the backend can enforce usage limits
        body: JSON.stringify({ indicator, timeframe, userId: user?.id }),
      });
      const designJson = await designRes.json();
      setDesignDesc(designJson.description);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Design Assistant</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Indicator</label>
          <input
            type="text"
            value={indicator}
            onChange={(e) => setIndicator(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Timeframe</label>
          <input
            type="text"
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
        </div>
        {validationResult && !validationResult.valid && (
          <div className="text-red-400 text-sm">
            <p>Invalid indicator(s): {validationResult.invalidIndicators.join(', ')}</p>
            <p>Suggestions: {Object.entries(validationResult.suggestions).map(([bad, good]) => `${bad}→${good}`).join(', ')}</p>
          </div>
        )}
        <button type="submit" className="edge-btn" disabled={submitting}>
          {submitting ? 'Generating…' : 'Generate Design'}
        </button>
      </form>
      {designDesc && (
        <div className="prose prose-invert max-w-none mt-6 border-t border-gray-600 pt-6">
          <h2 className="text-xl font-semibold mb-2">Strategy Concept</h2>
          <p>{designDesc}</p>
        </div>
      )}
    </div>
  );
}
