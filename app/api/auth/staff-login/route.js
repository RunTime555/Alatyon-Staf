// app/api/auth/staff-login/route.js
import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// Hardcoded staff accounts for portfolio demo
const STAFF_ACCOUNTS = {
  "doctor@alatyon.com":    { password: "doctor123", role: "Doctor",        name: "Dr. Almaz" },
  "lab@alatyon.com":       { password: "lab123",    role: "LabTechnician", name: "Abebe (Lab Tech)" },
  "admin@alatyon.com":     { password: "admin123",  role: "Admin",         name: "System Admin" },
};

export async function POST(request) {
  try {
    const { identifier, email, password } = await request.json();
    const inputEmail = (identifier || email)?.toLowerCase().trim();
    const account    = STAFF_ACCOUNTS[inputEmail];

    if (!account || password !== account.password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // ✅ Look up the real user ID from DB so routes work correctly
    let userId = inputEmail; // fallback
    try {
      const dbUser = await prisma.user.findFirst({
        where: { email: inputEmail },
        select: { id: true },
      });
      if (dbUser?.id) userId = dbUser.id;
    } catch {
      // DB lookup failed — use email as fallback ID (demo mode)
    }

    const token = signToken({
      id:    userId,
      email: inputEmail,
      role:  account.role,
      name:  account.name,
    });

    const response = NextResponse.json({
      success: true,
      role:    account.role,
      name:    account.name,
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   86400 * 7,
      path:     "/",
    });

    return response;
  } catch (err) {
    console.error("STAFF_LOGIN_ERROR:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}