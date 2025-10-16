/**
 * Simple API client for interacting with the edge-api service. All requests
 * are routed through the NEXT_PUBLIC_API_URL environment variable, which
 * should point at the running API instance for the current environment
 * (dev, staging, prod).
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function getSubscription(token: string) {
  const res = await fetch(`${API_URL}/subscriptions`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch subscription');
  }
  return res.json();
}

export async function createCheckoutSession(token: string, priceId: string, returnUrl: string) {
  const res = await fetch(`${API_URL}/checkout-session`, {
    method: 'POST'
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ priceId, returnUrl }),
  });
  if (!res.ok) {
    throw new Error('Failed to create checkout session');
  }
  return res.json();
}

export async function getUsage(token: string) {
  const res = await fetch(`${API_URL}/usage`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    throw new Error('Failed to fetch usage');
  }
  return res.json();
}
