import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

// Rate limiting setup (for horizontal scaling - use Redis in production)
const rateLimit = new Map();

export async function middleware(request: NextRequest) {
  // Only protect API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  // Skip auth for login/register
  const publicPaths = ['/api/auth/login', '/api/auth/register'];
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }
  
  // Check for token
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json(
      { error: 'Authentication required' },
      { status: 401 }
    );
  }
  
  const token = authHeader.split(' ')[1];
  const user = verifyToken(token);
  
  if (!user) {
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
  
  // Rate limiting (simple implementation)
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const key = `${ip}-${user.userId}`;
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 100;
  
  if (rateLimit.has(key)) {
    const data = rateLimit.get(key);
    if (now - data.start < windowMs) {
      if (data.count >= maxRequests) {
        return NextResponse.json(
          { error: 'Too many requests' },
          { status: 429 }
        );
      }
      data.count++;
    } else {
      rateLimit.set(key, { start: now, count: 1 });
    }
  } else {
    rateLimit.set(key, { start: now, count: 1 });
  }
  
  // Add user info to headers for downstream handlers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-user-id', user.userId);
  requestHeaders.set('x-user-role', user.role);
  
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: '/api/:path*',
};