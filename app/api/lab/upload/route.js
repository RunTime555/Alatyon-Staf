// app/api/lab/upload/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const cookieStore = await cookies();
    // 1. የኩኪ ስም ከ "token" ወደ "staff_token" ተቀይሯል
    const token = cookieStore.get("staff_token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. verifyToken async ስለሆነ await መጨመር አለበት
    const decoded = await verifyToken(token);
    
    if (!decoded?.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const { patientMrn, results } = await req.json();

    if (!patientMrn || !results?.length) {
      return NextResponse.json(
        { success: false, error: "patientMrn and results are required" },
        { status: 400 }
      );
    }

    // Find patient by MRN
    const patient = await prisma.user.findFirst({
      where: { mrn: patientMrn, role: "Patient" },
      select: { id: true, name: true },
    });

    if (!patient) {
      return NextResponse.json(
        { success: false, error: "Patient not found with MRN: " + patientMrn },
        { status: 404 }
      );
    }

    // Create all lab results
    const created = await prisma.labResult.createMany({
      data: results.map(r => ({
        testName:  r.testName,
        testValue: r.resultValue ?? r.testValue ?? "",
        unit:      r.unit ?? null,
        status:    "PENDING_DOCTOR",
        patientId: patient.id,
      })),
    });

    return NextResponse.json({
      success: true,
      message: `${created.count} result(s) uploaded for ${patient.name}`,
      count:   created.count,
    });
  } catch (err) {
    console.error("POST_LAB_UPLOAD:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}