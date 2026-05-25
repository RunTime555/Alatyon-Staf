// app/api/lab/result/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    
    // 1. የኩኪ ስም ከ "token" ወደ "staff_token" ተቀይሯል
    const token = cookieStore.get("staff_token")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    // 2. await ተጨምሯል (ይህ ወሳኝ ነው!)
    const decoded = await verifyToken(token);
    
    if (!decoded?.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Fetch lab result with patient data
    const result = await prisma.labResult.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id:   true,
            name: true,
            mrn:  true,
            labResults: {
              orderBy: { createdAt: "desc" },
              select: {
                id:        true,
                testName:  true,
                testValue: true,
                unit:      true,
                status:    true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!result) {
      return NextResponse.json({ success: false, error: "Result not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("GET_RESULT_ERROR:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}