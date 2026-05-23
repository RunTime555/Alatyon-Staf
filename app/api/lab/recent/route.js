// app/api/lab/recent/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Fetch the 20 most recent lab results uploaded by this lab technician
    const results = await prisma.labResult.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id:          true,
        testName:    true,
        testValue:   true,
        unit:        true,
        status:      true,
        createdAt:   true,
        patient: {
          select: {
            name: true,
            mrn:  true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: results });
  } catch (err) {
    console.error("GET_LAB_RECENT:", err);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}