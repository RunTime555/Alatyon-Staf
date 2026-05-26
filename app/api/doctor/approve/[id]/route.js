// app/api/doctor/approve/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const token = cookieStore.get("staff_token")?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const decoded = await verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });

    const { finalComment, doctorNote, severity } = await req.json();

    const parts = [];
    if (doctorNote?.trim())   parts.push(`DOCTOR_NOTE: ${doctorNote.trim()}`);
    if (finalComment?.trim()) parts.push(`AI_ANALYSIS: ${finalComment.trim()}`);

    const body = parts.join("\n\n---\n\n");
    const severityTag = `[${(severity ?? "normal").toUpperCase()}]`;
    const interpretation = body ? `${severityTag} ${body}` : severityTag;

    await prisma.labResult.update({
      where: { id },
      data: {
        status:         "COMPLETED",
        interpretation: interpretation,
        severity:       severity ?? "normal",
        // ✅ FIX: set reviewedAt so "Reviewed Today" card counts correctly
        reviewedAt:     new Date(),
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("APPROVE_ERROR:", err);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
}