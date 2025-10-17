import type { NextApiRequest, NextApiResponse } from 'next';
import pricingConfig from '../../pricing.config.json';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(pricingConfig);
}
