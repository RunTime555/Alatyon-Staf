// PATCH /api/doctor/action
// Handles APPROVE or REJECT with optional doctor note + AI
// Body: { resultId, action: "APPROVE"|"REJECT", doctorNote }
// ============================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
export async function PATCH(req) {
  try {
    const { resultId, action, doctorNote } = await req.json();
 
    if (!resultId || !action) {
      return NextResponse.json({ error: "resultId and action are required" }, { status: 400 });
    }
 
    const resultData = await prisma.labResult.findUnique({
      where: { id: resultId },
    });
 
    if (!resultData) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
 
    // ── REJECT ──
    if (action === "REJECT") {
      await prisma.labResult.update({
        where: { id: resultId },
        data: {
          status:          "REJECTED",
          interpretation:  doctorNote ? `REJECTED: ${doctorNote}` : "Rejected by doctor",
          reviewedAt:      new Date(),
        },
      });
      return NextResponse.json({ success: true });
    }
 
    // ── APPROVE with AI ──
    if (action === "APPROVE") {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
      const prompt = `
Medical Analysis: Test "${resultData.testName}" result is ${resultData.testValue}.
Doctor note: ${doctorNote ?? "None"}.
Write a concise, plain-language explanation (max 80 words) a patient can understand.
      `.trim();
 
      const aiRes   = await model.generateContent(prompt);
      const aiText  = aiRes.response.text();
 
      const combined = [
        doctorNote ? `DOCTOR_NOTE: ${doctorNote}` : null,
        `AI_INSIGHT: ${aiText}`,
      ]
        .filter(Boolean)
        .join("\n\n---\n\n");
 
      await prisma.labResult.update({
        where: { id: resultId },
        data: {
          status:          "COMPLETED",
          interpretation:  combined,
          reviewedAt:      new Date(),
        },
      });
 
      return NextResponse.json({ success: true, aiText });
    }
 
    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (err) {
    console.error("DOCTOR_ACTION:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}