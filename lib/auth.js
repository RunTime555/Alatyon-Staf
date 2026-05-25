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
  try {
    const blacklisted = await redis.get(`blacklist:${token}`);
    if (blacklisted) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
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