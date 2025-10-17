import type { NextApiRequest, NextApiResponse } from 'next';

// Proxy endpoint to validate indicators for the Design assistant. It forwards the request
// to the backend API and returns the response. Accepts either `indicators` array or `strategyText` in the body.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const resp = await fetch(`${apiUrl}/design/validate-indicators`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error validating indicators:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
