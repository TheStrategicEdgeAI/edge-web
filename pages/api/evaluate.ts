import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy the evaluate assistant request to the backend API. This handler accepts a GET
// request with a `topic` query parameter and forwards it to the `/evaluate` endpoint
// on the API server defined by NEXT_PUBLIC_API_URL. It returns the summary JSON to
// the Next.js client.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }
  const { topic, userId } = req.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const url = new URL('/evaluate', apiUrl);
  if (typeof topic === 'string' && topic) {
    url.searchParams.set('topic', topic);
  }
  if (typeof userId === 'string' && userId) {
    url.searchParams.set('userId', userId);
  }
  try {
    const resp = await fetch(url.toString());
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error proxying evaluate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
