// pages/api/notes/index.js
import connectToDatabase from '../../../lib/db';
import Note from '../../../lib/models/Note';
import { setCors } from '../../../lib/cors';
import { getUserFromReq } from '../../../lib/auth';
import Tenant from '../../../lib/models/Tenant';

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') return;

  await connectToDatabase();
  const ctx = await getUserFromReq(req);
  if (!ctx) return res.status(401).json({ message: 'Unauthorized' });

  const { user, tenant } = ctx;

  // GET all notes
  if (req.method === 'GET') {
    const notes = await Note.find({ tenantSlug: tenant.slug })
      .sort({ updatedAt: -1 })
      .lean();
    return res.json({ notes });
  }

  // POST new note
  if (req.method === 'POST') {
    const { title, content } = req.body || {};

    // enforce free plan limit
    if (tenant.plan === 'free') {
      const count = await Note.countDocuments({ tenantId: tenant._id });
      if (count >= 3) {
        return res
          .status(403)
          .json({ message: 'Free plan limit reached. Upgrade to Pro.' });
      }
    }

    const note = await Note.create({
      title: title || '',
      content: content || '',
      tenantId: tenant._id,
      tenantSlug: tenant.slug,
      authorId: user._id,
    });

    return res.status(201).json({ note });
  }

  return res.status(405).end(); // method not allowed
}
