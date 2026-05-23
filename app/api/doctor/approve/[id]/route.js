// app/api/doctor/approve/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req, { params }) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const { id } = await params;
    const { finalComment, doctorNote, severity } = await req.json();

    // Build interpretation — parsed by patient dashboard
    // Format: "[SEVERITY] DOCTOR_NOTE: ... --- AI_ANALYSIS: ..."
    const parts = [];
    if (doctorNote?.trim())   parts.push(`DOCTOR_NOTE: ${doctorNote.trim()}`);
    if (finalComment?.trim()) parts.push(`AI_ANALYSIS: ${finalComment.trim()}`);
    const body = parts.join("\n\n---\n\n");
    const severityTag = `[${(severity ?? "normal").toUpperCase()}]`;
    const interpretation = body ? `${severityTag} ${body}` : severityTag;

    // ✅ Only update fields that exist in your Prisma schema
    await prisma.labResult.update({
      where: { id },
      data: {
        status:         "COMPLETED",
        interpretation: interpretation,
        // doctorComment and reviewedAt are NOT in your schema — skip them
      },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("APPROVE:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}