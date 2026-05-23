// app/api/profile/route.js
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

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true, name: true, email: true, phone: true,
        address: true, mrn: true, image: true,
        bloodGroup: true, emergencyContact: true,
        emergencyPhone: true, occupation: true,
        dob: true, role: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    // ✅ Serialize dob to plain string for the frontend date input
    return NextResponse.json({
      ...user,
      dob: user.dob ? user.dob.toISOString().split("T")[0] : null,
    });
  } catch (err) {
    console.error("GET_PROFILE:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded?.id) return NextResponse.json({ error: "Invalid token" }, { status: 401 });

    const body = await req.json();
    const {
      name, phone, address, image,
      bloodGroup, emergencyContact,
      emergencyPhone, occupation, dob,
    } = body;

    // ✅ Convert dob string → DateTime (Prisma requires DateTime, not plain string)
    const dobDate = dob ? new Date(dob) : null;

    // ✅ Only update fields that were actually sent (avoid overwriting with undefined)
    const data = {};
    if (name             !== undefined) data.name             = name;
    if (phone            !== undefined) data.phone            = phone;
    if (address          !== undefined) data.address          = address;
    if (image            !== undefined) data.image            = image;
    if (bloodGroup       !== undefined) data.bloodGroup       = bloodGroup;
    if (emergencyContact !== undefined) data.emergencyContact = emergencyContact;
    if (emergencyPhone   !== undefined) data.emergencyPhone   = emergencyPhone;
    if (occupation       !== undefined) data.occupation       = occupation;
    if (dob              !== undefined) data.dob              = dobDate;

    const updated = await prisma.user.update({
      where: { id: decoded.id },
      data,
    });

    return NextResponse.json({
      success: true,
      user: {
        ...updated,
        dob: updated.dob ? updated.dob.toISOString().split("T")[0] : null,
      },
    });
  } catch (err) {
    console.error("PUT_PROFILE:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}