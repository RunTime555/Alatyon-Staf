import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redis from "./redis";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

// ── Token sign ─────────────────────────────────────────────
export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

// ── Token verify ───────────────────────────────────────────
export const verifyToken = async (token) => {
  try {
    // 1. Blacklist ውስጥ ነው? (logout የተደረገ)
    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) return null;

    // 2. JWT ን አረጋግጥ
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// ── የተገባ user ን አምጣ ─────────────────────────────────────
export const getAuthUser = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get("staff_token")?.value;
  if (!token) return null;

  const decoded = await verifyToken(token);
  return decoded ?? null;
};

// ── Logout — token ን blacklist አድርግ ───────────────────────
export const invalidateToken = async (token) => {
  await redis.set(`blacklist:${token}`, "1", { ex: 60 * 60 * 24 });
};