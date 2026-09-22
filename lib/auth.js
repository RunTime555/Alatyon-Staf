import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import redis from "./redis";

const JWT_SECRET = process.env.JWT_SECRET || "your-super-secret-key";

// ── Cookie Options (JavaScript Friendly) ──────────────────────
export const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax", // 'as const' ተወግዷል
  path: "/",
};

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });
};

export const verifyToken = async (token) => {
  // 1. First check the JWT itself is valid/unexpired.
  //    This is fast, local, and has no external dependency.
  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }

  // 2. Then check Redis for a blacklist hit — but if Redis is
  //    unreachable, don't let that block a legitimately valid token.
  //    Fail OPEN on connection errors, fail CLOSED only on an
  //    actual blacklist match.
  try {
    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) return null;
  } catch (error) {
    console.error("REDIS_BLACKLIST_CHECK_FAILED:", error.message);
  }

  return decoded;
};

export const getAuthUser = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("staff_token")?.value;

  if (!token) return null;

  return await verifyToken(token);
};

// ── Login ላይ የምትጠቀመው Function ──────────────────────────
export const setAuthCookie = async (token) => {
  const cookieStore = await cookies();
  cookieStore.set("staff_token", token, cookieOptions);
};