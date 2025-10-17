import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }
  const { customerId } = req.body;
  if (!customerId) {
    return res.status(400).json({ error: 'customerId is required' });
  }
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  try {
    const resp = await fetch(`${apiUrl}/stripe/customer-portal`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customerId }),
    });
    const data = await resp.json();
    res.status(resp.status).json(data);
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
