import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory user database for testing
const USERS = [
  { id: "P0001", email: "test@patient.com", password: "Patient123", role: "patient", name: "Test Patient" },
  { id: "P0002", email: "john.doe@email.com", password: "Patient123", role: "patient", name: "John Doe" },
  { id: "D0001", email: "dr.anderson@hospital.com", password: "Patient123", role: "doctor", name: "Dr. Anderson" },
  { id: "LT0001", email: "lab.tech1@hospital.com", password: "Patient123", role: "lab_technician", name: "Lab Tech" }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    console.log("🔐 Login attempt:", email);
    
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }
    
    // Find user
    const user = USERS.find(u => u.email === email && u.password === password);
    
    if (!user) {
      console.log("❌ User not found:", email);
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }
    
    console.log("✅ Login successful:", user.id);
    
    return NextResponse.json({
      success: true,
      data: {
        token: "token-" + user.id + "-" + Date.now(),
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      }
    });
    
  } catch (error) {
    console.error("💥 Error:", error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}