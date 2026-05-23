// app/api/results/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const results = await prisma.labResult.findMany({
      where:   { patientId: decoded.id },
      orderBy: { createdAt: "desc" },
      select: {
        id:             true,
        testName:       true,
        testValue:      true,
        unit:           true,
        status:         true,
        interpretation: true,
        doctorComment:  true,
        createdAt:      true,
        reviewedAt:     true,
      },
    });

    return NextResponse.json({ success: true, results });
  } catch (err) {
    console.error("GET_RESULTS:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}