import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

interface SubscriptionInfo {
  plan: string;
  entitlements: Record<string, any>;
  stripe_customer_id?: string;
}

export default function Evaluate() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [topic, setTopic] = useState('');
  const [summary, setSummary] = useState<string | null>(null);
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
  if (!subInfo?.entitlements?.evaluate) {
    return <div className="min-h-screen p-8">Evaluate is not available for your plan.</div>;
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSummary(null);
    try {
      const params = new URLSearchParams();
      if (topic) params.set('topic', topic);
      // Include userId to enforce usage limits on the API. The API proxy will
      // append this to the backend request.
      if (user?.id) params.set('userId', user.id);
      const res = await fetch(`/api/evaluate?${params.toString()}`);
      const data = await res.json();
      setSummary(data.summary || 'No summary available.');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Evaluate Assistant</h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        <div>
          <label className="block mb-1 font-medium">Topic or Concept</label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Moving Averages"
            className="w-full p-2 rounded-md bg-gray-800 text-white"
          />
        </div>
        <button type="submit" className="edge-btn" disabled={submitting}>
          {submitting ? 'Loading…' : 'Get Summary'}
        </button>
      </form>
      {summary && (
        <div className="prose prose-invert max-w-none mt-6 border-t border-gray-600 pt-6">
          <h2 className="text-xl font-semibold mb-2">Summary</h2>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
