// POST /api/doctor/approve/:id
// Approves a result, saves doctor note + AI analysis, marks COMPLETED
// ============================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
 
export async function POST(req, { params }) {
  try {
    const { id } = await params;           // ✅ Next.js 15
    const { finalComment, doctorNote } = await req.json();
 
    // Combine AI analysis and doctor note in the interpretation field
    const interpretation = [
      doctorNote ? `DOCTOR_NOTE: ${doctorNote}` : null,
      finalComment ? `AI_ANALYSIS: ${finalComment}` : null,
    ]
      .filter(Boolean)
      .join("\n\n---\n\n");
 
    await prisma.labResult.update({
      where: { id },
      data: {
        doctorComment:   finalComment ?? null,
        interpretation:  interpretation || null,
        status:          "COMPLETED",
        reviewedAt:      new Date(),
      },
    });
 
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("APPROVE:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}