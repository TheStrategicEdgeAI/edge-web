import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy endpoint for the Evolve analysis. It forwards the trades array to the backend API
// and returns computed metrics. The request body should include a JSON object with a
// `trades` array of numbers.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const { trades } = req.body as { trades: any };
  if (!Array.isArray(trades)) {
    return res.status(400).json({ error: 'Request body must include a `trades` array' });
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const resp = await fetch(`${apiUrl}/evolve/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ trades }),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error calling evolve analysis:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
