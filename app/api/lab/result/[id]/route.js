// GET /api/lab/result/:id
// Returns a single lab result with patient info
// ============================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function GET(req, { params }) {
  try {
    const { id } = await params;           // ✅ Next.js 15 — await params
 
    const result = await prisma.labResult.findUnique({
      where: { id },
      include: { patient: true },
    });
 
    if (!result) {
      return NextResponse.json({ error: "Not Found" }, { status: 404 });
    }
 
    return NextResponse.json(result);
  } catch (err) {
    console.error("GET_RESULT:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}