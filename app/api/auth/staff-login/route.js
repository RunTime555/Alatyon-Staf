import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Hardcoded staff accounts for demo
const STAFF_ACCOUNTS = {
  "doctor@alatyon.com":    { password: "doctor123", role: "Doctor",        name: "Dr. Almaz" },
  "lab@alatyon.com":       { password: "lab123",    role: "LabTechnician", name: "Abebe (Lab Tech)" },
  "admin@alatyon.com":     { password: "admin123",  role: "Admin",         name: "System Admin" },
};

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();
    const inputEmail = identifier?.toLowerCase().trim();
    const account    = STAFF_ACCOUNTS[inputEmail];

    // 1. መታወቂያ እና የይለፍ ቃል ማረጋገጥ
    if (!account || password !== account.password) {
      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 2. የተጠቃሚ መታወቂያ (User ID) ከ DB መፈለግ
    let userId = inputEmail; 
    try {
      const dbUser = await prisma.user.findFirst({
        where: { email: inputEmail },
        select: { id: true },
      });
      if (dbUser?.id) userId = dbUser.id;
    } catch (err) {
      console.error("DB lookup error:", err);
    }

    // 3. ቶከን መፍጠር
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

    // 4. ኩኪውን "staff_token" በሚል ስም መላክ (ይህ በጣም አስፈላጊ ነው!)
    response.cookies.set("staff_token", token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge:   86400 * 7, // 7 days
      path:     "/",
    });

    return response;
  } catch (err) {
    console.error("STAFF_LOGIN_ERROR:", err);
    return NextResponse.json({ success: false, error: "Login failed" }, { status: 500 });
  }
}
