import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy endpoint to generate a strategy script. Expects a JSON body with platform ("ninja" or "pine"),
// indicator, and optionally timeframe. Forwards to the backend API and returns the generated script.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const { platform, indicator, timeframe, userId } = req.body as {
    platform: string;
    indicator?: string;
    timeframe?: string;
    userId?: string;
  };
  if (!platform) {
    return res.status(400).json({ error: 'platform is required' });
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const resp = await fetch(`${apiUrl}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ platform, indicator, timeframe, userId }),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error generating strategy:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
