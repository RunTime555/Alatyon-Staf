// app/api/dashboard/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const patient = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id:   true,
        name: true,
        mrn:  true,
        labResults: {             // ✅ correct relation name
          orderBy: { createdAt: "desc" },
          select: {
            id:             true,
            testName:       true,
            testValue:      true,
            unit:           true,
            status:         true,
            interpretation: true,
            category:       true,
            createdAt:      true,
          },
        },
      },
    });

    if (!patient) return NextResponse.json({ error: "Patient not found" }, { status: 404 });

    return NextResponse.json({
      name:    patient.name,
      mrn:     patient.mrn,
      results: patient.labResults,
    });
  } catch (err) {
    console.error("GET_DASHBOARD:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}