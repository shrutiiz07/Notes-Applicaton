// pages/api/auth/login.js
import connectToDatabase from '../../../lib/db';
import { setCors } from '../../../lib/cors';
import Tenant from '../../../lib/models/Tenant';
import User from '../../../lib/models/User';
import { comparePassword, hashPassword, signToken } from '../../../lib/auth';

async function seedIfNeeded() {
  // create tenants if missing
  let acme = await Tenant.findOne({ slug: 'acme' });
  if (!acme) acme = await Tenant.create({ name: 'Acme', slug: 'acme', plan: 'free' });

  let globex = await Tenant.findOne({ slug: 'globex' });
  if (!globex) globex = await Tenant.create({ name: 'Globex', slug: 'globex', plan: 'free' });

  // create users
  const createUserIfMissing = async (email, role, tenant) => {
    const exists = await User.findOne({ email });
    if (!exists) {
      const hash = await hashPassword('password');
      await User.create({
        email,
        passwordHash: hash,
        role,
        tenantId: tenant._id,
        tenantSlug: tenant.slug
      });
    }
  };

  await createUserIfMissing('admin@acme.test', 'Admin', acme);
  await createUserIfMissing('user@acme.test', 'Member', acme);
  await createUserIfMissing('admin@globex.test', 'Admin', globex);
  await createUserIfMissing('user@globex.test', 'Member', globex);
}

export default async function handler(req, res) {
  setCors(res, req);
  if (req.method === 'OPTIONS') return;

  await connectToDatabase();
  await seedIfNeeded();

  if (req.method !== 'POST') return res.status(405).json({ message: 'Only POST' });

  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ message: 'email & password required' });

  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  const token = signToken({ userId: user._id.toString(), role: user.role, tenantSlug: user.tenantSlug });
  res.json({ token, user: { email: user.email, role: user.role, tenantSlug: user.tenantSlug } });
}








































































































