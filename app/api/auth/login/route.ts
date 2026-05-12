import { signToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    let role = 'Patient';
    
    // ሎጂኩን ግልጽ እናድርገው
    if (email.includes('doctor')) {
      role = 'Doctor';
    } else if (email.includes('lab')) {
      role = 'LabTech'; // "lab" ያለበት ኢሜይል ከሆነ LabTech እንዲሆን
    } else if (email.includes('admin')) {
      role = 'Admin';
    }

    const token = signToken({ email, role });

    const response = NextResponse.json({ 
      success: true, 
      message: "Logged in successfully",
      role 
    });

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 86400,
      path: '/',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 400 });
  }
}