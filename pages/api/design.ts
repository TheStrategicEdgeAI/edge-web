import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy the design assistant request to the backend API. This handler accepts a POST
// request with JSON body containing `indicator` and `timeframe` and forwards it to
// the `/design` endpoint on the API server. It returns the conceptual strategy
// description to the Next.js client.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const { indicator, timeframe, userId } = req.body || {};
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const resp = await fetch(`${apiUrl}/design`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ indicator, timeframe, userId }),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error proxying design:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
