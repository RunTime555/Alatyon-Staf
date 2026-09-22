// app/api/doctor/analyze/[id]/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Strips common Markdown artifacts (headers, bold/italic asterisks,
// bullet dashes) in case the model adds them despite instructions.
function stripMarkdown(text) {
  return text
    .replace(/^#{1,6}\s*/gm, "")     // ### Headers
    .replace(/\*\*(.*?)\*\*/g, "$1") // **bold**
    .replace(/\*(.*?)\*/g, "$1")     // *italic*
    .replace(/^[-*]\s+/gm, "")       // - bullet or * bullet
    .replace(/\n{3,}/g, "\n\n")      // collapse extra blank lines
    .trim();
}

export async function GET(req, { params }) {
  try {
    
    const { id } = await params;
    
    const cookieStore = await cookies();
   
    const token = cookieStore.get("staff_token")?.value;
    
    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

   
    const decoded = await verifyToken(token);
    if (!decoded?.id) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    const result = await prisma.labResult.findUnique({
      where: { id },
      include: { patient: { select: { name: true } } },
    });

    if (!result) {
      return NextResponse.json({ success: false, error: "Result not found" }, { status: 404 });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `
A patient just received this lab result:

Test: ${result.testName}
Result Value: ${result.testValue ?? "N/A"} ${result.unit ?? ""}

Write a short message directly to the patient explaining, in plain everyday language:
1. What this result means for them.
2. Simple, practical advice on what they should do next (e.g. see a doctor, no action needed, retest, lifestyle tip).

Rules:
- 2 to 4 short sentences total. Nothing longer.
- Plain text only. No Markdown, no headers, no asterisks, no bullet points, no numbering, no symbols like # or *.
- Do not include a greeting, sign-off, or disclaimer.
- Write it as if speaking directly to the patient ("you"), in a warm but clear tone.
    `.trim();

    const aiRes = await model.generateContent(prompt);
    const analysis = stripMarkdown(aiRes.response.text());

    return NextResponse.json({ success: true, analysis });
  } catch (err) {
    console.error("AI_ANALYZE_ERROR:", err);
    return NextResponse.json({ success: false, error: "AI analysis failed" }, { status: 500 });
  }
}