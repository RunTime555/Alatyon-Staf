import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-middleware';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Check authentication
  const authError = requireAuth(request);
  if (authError) return authError;
  
  return NextResponse.json({
    success: true,
    data: {
      patient_id: params.id,
      tests: []
    }
  });
}