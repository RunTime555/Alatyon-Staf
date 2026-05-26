// app/api/doctor/stats/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("staff_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const [pending, reviewedToday, critical, aiAnalyses] = await Promise.all([
      // Pending reviews
      prisma.labResult.count({
        where: { status: "PENDING_DOCTOR" },
      }),
      // ✅ Reviewed today — uses reviewedAt (now set by approve route)
      prisma.labResult.count({
        where: {
          status:     "COMPLETED",
          reviewedAt: { gte: todayStart, lte: todayEnd },
        },
      }),
      // Critical cases — uses severity field
      prisma.labResult.count({
        where: { severity: "critical" },
      }),
      // ✅ FIX: AI Analyses — only count records where doctor used AI
      // interpretation contains "AI_ANALYSIS:" meaning AI was generated
      prisma.labResult.count({
        where: {
          interpretation: { contains: "AI_ANALYSIS:" },
        },
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: { pending, reviewedToday, critical, aiAnalyses },
    });
  } catch (err) {
    console.error("STATS_ERROR:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}