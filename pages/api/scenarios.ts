import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy endpoint to fetch available scenario drills from the backend API. This returns a list of
// scenario templates that the Evolve assistant can present to the user.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end('Method Not Allowed');
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const resp = await fetch(`${apiUrl}/scenarios`);
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error fetching scenarios:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
