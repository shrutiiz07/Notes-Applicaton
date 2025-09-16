// pages/api/tenants/[slug]/upgrade.js
import connectToDatabase from "../../../../lib/db";
import { setCors } from "../../../../lib/cors";
import { getUserFromReq } from "../../../../lib/auth";
import Tenant from "../../../../lib/models/Tenant";

export default async function handler(req, res) {
  // ✅ Setup CORS
  setCors(res, req);
  if (req.method === "OPTIONS") return;

  // ✅ Only allow POST method
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    await connectToDatabase();

    // ✅ Get logged-in user context
    const ctx = await getUserFromReq(req);
    if (!ctx) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { user } = ctx;
    const { slug } = req.query;

    // ✅ Ensure user is from the same tenant
    if (user.tenantSlug !== slug) {
      return res.status(403).json({ message: "Not allowed for this tenant" });
    }

    // ✅ Check role (case-insensitive to avoid mismatch)
    if (user.role.toLowerCase() !== "admin") {
      return res.status(403).json({ message: "Admin only" });
    }

    // ✅ Find tenant
    const tenant = await Tenant.findOne({ slug });
    if (!tenant) {
      return res.status(404).json({ message: "Tenant not found" });
    }

    // ✅ Upgrade plan
    tenant.plan = "pro";
    await tenant.save();

    return res
      .status(200)
      .json({ message: "Tenant upgraded to Pro!", tenant });
  } catch (err) {
    console.error("Upgrade error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
