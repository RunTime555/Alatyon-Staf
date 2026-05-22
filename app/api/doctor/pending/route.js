// GET /api/doctor/pending
// Returns all lab results with status PENDING_DOCTOR
// ============================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function GET() {
  try {
    const results = await prisma.labResult.findMany({
      where: { status: "PENDING_DOCTOR" },
      include: {
        patient: { select: { name: true, mrn: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(results);
  } catch (err) {
    console.error("GET_PENDING:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}