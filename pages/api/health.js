// pages/api/health.js
import { setCors } from '../../lib/cors';
export default function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') return;
  res.json({ status: 'ok' });
}
