// proxy.ts — project ROOT (replaces middleware.js in Next.js 16+)
// Rename your middleware.js to proxy.ts to fix the deprecation warning.

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/admin/login",
  "/register",
  "/forgot-password",
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow public paths, static files, and ALL api routes
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/api/")
  ) {
    return NextResponse.next();
  }

  // Check token cookie exists
  const token = req.cookies.get("token")?.value;

  if (!token) {
    // Detect which login page to send to based on path
    const isAdminOrStaff =
      pathname.startsWith("/doctor") ||
      pathname.startsWith("/lab") ||
      pathname.startsWith("/admin");

    const loginUrl = isAdminOrStaff
      ? new URL("/admin/login", req.url)
      : new URL("/login", req.url);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};