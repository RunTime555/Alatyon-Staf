import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Logout is handled client-side by deleting the token
  // This endpoint exists for completeness
  return NextResponse.json({
    success: true,
    message: 'Logged out successfully'
  });
}