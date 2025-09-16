// lib/auth.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from './models/User';
import Tenant from './models/Tenant';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET missing');

export const hashPassword = (p) => bcrypt.hash(p, 10);
export const comparePassword = (p, h) => bcrypt.compare(p, h);

export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

export async function getUserFromReq(req) {
  const auth = req.headers.authorization || '';
  if (!auth.startsWith('Bearer ')) return null;
  const token = auth.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const user = await User.findById(payload.userId).lean();
    if (!user) return null;
    const tenant = await Tenant.findById(user.tenantId).lean();
    return { user, tenant };
  } catch (err) {
    return null;
  }
}
