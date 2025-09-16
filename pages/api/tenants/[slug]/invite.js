// pages/api/tenants/[slug]/invite.js
import connectToDatabase from '../../../../lib/db';
import Tenant from '../../../../lib/models/Tenant';
import User from '../../../../lib/models/User';
import { setCors } from '../../../../lib/cors';
import { getUserFromReq } from '../../../../lib/auth';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') return;

  await connectToDatabase();

  const ctx = await getUserFromReq(req);
  if (!ctx) return res.status(401).json({ message: 'Unauthorized' });

  const { user, tenant } = ctx;

  // ensure tenant matches slug
  const { slug } = req.query;
  if (tenant.slug !== slug) {
    return res.status(403).json({ message: 'Forbidden: Tenant mismatch' });
  }

  // admin check
  if (user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden: Admins only' });
  }

  // only allow POST
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email, role } = req.body || {};
  if (!email || !role) {
    return res.status(400).json({ message: 'Email and role required' });
  }

  // check if user already exists
  const existing = await User.findOne({ email, tenantId: tenant._id });
  if (existing) {
    return res.status(400).json({ message: 'User already exists in this tenant' });
  }

  // hash default password
  const hashed = await bcrypt.hash('password', 10);

  const newUser = await User.create({
    email,
    role,
    password: hashed,
    tenantId: tenant._id,
    tenantSlug: tenant.slug,
  });

  return res.status(201).json({
    user: {
      _id: newUser._id,
      email: newUser.email,
      role: newUser.role,
      tenantSlug: newUser.tenantSlug,
    },
  });
}
