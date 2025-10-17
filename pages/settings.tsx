import React, { useEffect, useState } from 'react';

interface SubscriptionInfo {
  plan: string;
  status: string;
  current_period_end: string;
  entitlements: Record<string, any>;
  stripe_customer_id?: string; // include this on the server response once you save it
}

export default function Settings() {
  const [subInfo, setSubInfo] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    async function loadSubscription() {
      try {
        const res = await fetch('/api/subscription'); // proxy to /subscriptions?userId=
        const data = await res.json();
        setSubInfo(data);
      } finally {
        setLoading(false);
      }
    }
    loadSubscription();
  }, []);

  const handleManageBilling = async () => {
    if (!subInfo?.stripe_customer_id) return;
    setPortalLoading(true);
    try {
      const res = await fetch('/api/create-portal-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: subInfo.stripe_customer_id }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } finally {
      setPortalLoading(false);
    }
  };

  if (loading) return <div className="min-h-screen p-8">Loading your subscription…</div>;
  if (!subInfo) return <div className="min-h-screen p-8">No subscription found.</div>;

  return (
    <div className="min-h-screen p-8 space-y-6">
      <h1 className="text-3xl font-bold">Your Plan</h1>
      <p>
        Plan: <strong>{subInfo.plan}</strong> — Status: <strong>{subInfo.status}</strong>
      </p>
      <button
        className="edge-btn"
        onClick={handleManageBilling}
        disabled={portalLoading}
      >
        {portalLoading ? 'Loading…' : 'Manage Billing'}
      </button>
    </div>
  );
}
