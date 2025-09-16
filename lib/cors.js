// lib/cors.js
export function setCors(res, req) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req && req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  return false;
}
