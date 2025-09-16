// pages/api/notes/[id].js
import connectToDatabase from '../../../lib/db';
import Note from '../../../lib/models/Note';
import { setCors } from '../../../lib/cors';
import { getUserFromReq } from '../../../lib/auth';

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') return;

  await connectToDatabase();
  const ctx = await getUserFromReq(req);
  if (!ctx) return res.status(401).json({ message: 'Unauthorized' });

  const { user, tenant } = ctx;
  const { id } = req.query;

  const note = await Note.findById(id);
  if (!note || note.tenantSlug !== tenant.slug) {
    return res.status(404).json({ message: 'Note not found' });
  }

  // Permissions: allow only Admins or the creator
  const canModify = user.role === 'Admin' || note.userId?.toString() === user._id.toString();
  if ((req.method === 'PUT' || req.method === 'DELETE') && !canModify) {
    return res.status(403).json({ message: 'Forbidden: not allowed to modify this note' });
  }

  if (req.method === 'GET') {
    return res.json({ note });
  }

  if (req.method === 'PUT') {
    const { title, content } = req.body || {};
    note.title = title ?? note.title;
    note.content = content ?? note.content;
    await note.save();
    return res.json({ note });
  }

  if (req.method === 'DELETE') {
    await note.deleteOne();
    return res.json({ message: 'Note deleted successfully' });
  }

  return res.status(405).json({ message: `Method ${req.method} not allowed` });
}

