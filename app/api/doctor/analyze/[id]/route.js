
// GET /api/doctor/analyze/:id
// Runs Gemini AI on the lab result and returns the analysis
// ============================================================
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
 
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 
export async function GET(req, { params }) {
  try {
    const { id } = await params;           // ✅ Next.js 15
 
    const result = await prisma.labResult.findUnique({
      where: { id },
      include: { patient: true },
    });
 
    if (!result) {
      return NextResponse.json({ error: "Result not found" }, { status: 404 });
    }
 
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
 
    const prompt = `
You are a clinical decision-support assistant. Analyze the following lab result and provide:
1. A structured clinical interpretation
2. Potential diagnoses or differentials to consider
3. Recommended follow-up actions
4. Clear, compassionate advice the doctor can relay to the patient
 
Patient: ${result.patient?.name ?? "Unknown"}
Test: ${result.testType ?? result.testName}
Value: ${result.value ?? result.resultValue}
${result.unit ? `Unit: ${result.unit}` : ""}
 
Keep the response professional, concise, and well-structured with clear headings.
    `.trim();
 
    const aiRes  = await model.generateContent(prompt);
    const analysis = aiRes.response.text();
 
    return NextResponse.json({ analysis });
  } catch (err) {
    console.error("AI_ANALYZE:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}