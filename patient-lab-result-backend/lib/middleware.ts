import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, TokenPayload } from './auth';

export async function requireAuth(request: NextRequest, allowedRoles?: string[]) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return {
      error: NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      ),
      user: null
    };
  }
  
  const user = verifyToken(token);
  
  if (!user) {
    return {
      error: NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      ),
      user: null
    };
  }
  
  // Check role if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      ),
      user: null
    };
  }
  
  return { error: null, user };
}

export function successResponse(data: any, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}