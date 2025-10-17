import React, { useState } from 'react';
import { useRouter } from 'next/router';
import pricingConfig from '../pricing.config.json';

export default function Signup() {
  const router = useRouter();
  const { plan: planQuery } = router.query;
  const planId = typeof planQuery === 'string' ? planQuery : 'basic';
  const plan = pricingConfig.plans[planId] || pricingConfig.plans.basic;
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      // Obtain a login token from the API (optional). In a real app this would send a magic link.
      const loginRes = await fetch(process.env.NEXT_PUBLIC_API_URL + '/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const loginJson = await loginRes.json();
      if (!loginRes.ok) {
        throw new Error(loginJson.error || 'Failed to login');
      }
      // Create a checkout session for the selected plan via an internal API route.
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout');
      }
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-8 flex flex-col items-center text-center space-y-6">
      <h1 className="text-3xl font-bold">Sign up for {plan.label}</h1>
      <p className="text-xl">${plan.price}/mo</p>
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md">
        <input
          type="email"
          required
          className="w-full p-3 rounded-md bg-gray-800 text-white"
          placeholder="your.email@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          className="edge-btn w-full"
          disabled={loading}
        >
          {loading ? 'Processing…' : `Subscribe to ${plan.label}`}
        </button>
      </form>
    </div>
  );
}
