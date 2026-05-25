// proxy.js — project ROOT
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/forgot-password",
  "/api/auth",
];

// ስሙን 'proxy' ብለነዋል
export function proxy(req) {
  const { pathname } = req.nextUrl;

  // 1. የህዝብ መንገዶችን (Public paths) እና ስታቲክ ፋይሎችን ይለፍ
  if (
    PUBLIC_PATHS.some(p => pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // 2. ኩኪውን በ staff_token ስም ይፈልግ
  const token = req.cookies.get("staff_token")?.value;

  // 3. ቶከን ከሌለ ወደ login ይላክ
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    return NextResponse.redirect(loginUrl);
  }

  // 4. ቶከን ካለ ወደፈለገው ገጽ ይግባ
  return NextResponse.next();
}

// Config: አሁን ይሄ የProxy ስራ እንዲሆን ተዋቅሯል
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};