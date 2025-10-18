import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { pricingConfig, type PlanKey } from '@/config/pricing';

function isPlanKey(s: string): s is PlanKey {
  return (['basic', 'pro', 'elite'] as const).includes(s as PlanKey);
}

export default function SignupPage() {
  const router = useRouter();

  // The query can be undefined on first render; memo to avoid extra work.
  const planKey: PlanKey = useMemo(() => {
    const q = router.query.plan;
    if (typeof q === 'string' && isPlanKey(q)) return q;
    return 'basic';
  }, [router.query.plan]);

  const plan = pricingConfig.plans[planKey];

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: wire this to your real signup/checkout flow
      await new Promise((r) => setTimeout(r, 300));
      alert(`Signing up ${email} for ${plan.name} (${plan.id})`);
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: 640, margin: '0 auto', padding: 24 }}>
      <h1 style={{ marginBottom: 8 }}>Create your account</h1>
      <p style={{ color: '#555' }}>
        Selected plan: <strong>{plan.name}</strong> — ${plan.price}/mo
      </p>

      <form onSubmit={onSubmit} style={{ marginTop: 16 }}>
        <label style={{ display: 'block', marginBottom: 8 }}>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: 8,
              marginTop: 6,
            }}
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 12,
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid #111827',
            background: loading ? '#9ca3af' : '#111827',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Processing…' : `Continue with ${plan.name}`}
        </button>

        {error && <p style={{ color: 'crimson', marginTop: 10 }}>{error}</p>}
      </form>
    </main>
  );
}
