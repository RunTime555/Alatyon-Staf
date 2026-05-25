// app/api/doctor/pending/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    // 1. የኩኪ ስም ከ "token" ወደ "staff_token" ተቀይሯል
    const token = cookieStore.get("staff_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. await ተጨምሯል (ይህ በጣም አስፈላጊ ነው!)
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
    });

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("GET_PENDING:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}