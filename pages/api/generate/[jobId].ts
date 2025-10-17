import type { NextApiRequest, NextApiResponse } from 'next'

// This API route proxies requests to fetch the status of a generation job.
// It expects the jobId in the URL path (e.g., /api/generate/123). It will
// call the backend API at /generate/:jobId and return the JSON response.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET'])
    return res.status(405).end('Method Not Allowed')
  }
  const { jobId } = req.query
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  try {
    const resp = await fetch(`${apiUrl}/generate/${jobId}`)
    const data = await resp.json()
    res.status(resp.status).json(data)
  } catch (error: any) {
    console.error('Error fetching generation result:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}
