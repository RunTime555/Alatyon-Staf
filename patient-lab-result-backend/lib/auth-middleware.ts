import { NextRequest, NextResponse } from 'next/server';

// Simple auth check (replace with real JWT validation later)
export function requireAuth(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const token = authHeader.substring(7);
  
  // Simple token validation (replace with real JWT validation)
  if (!token || token === 'undefined' || token === 'null') {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
  
  return null; // No error, continue
}