// app/api/doctor/pending/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("staff_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded = await verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const results = await prisma.labResult.findMany({
      where:   { status: "PENDING_DOCTOR" },
      orderBy: { createdAt: "desc" },
      include: {
        patient: {
          select: { name: true, mrn: true },
        },
      },
      // ✅ FIX: severity is already included by default (no select = all fields returned)
      // This comment is here just to confirm — findMany with include returns all scalar fields
    });

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("GET_PENDING:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}