import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { invalidateToken } from "@/lib/auth";

export async function POST() {
  const token = cookies().get("staff_token")?.value;
  if (token) await invalidateToken(token);

  const res = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL)
  );
  res.cookies.delete("staff_token");
  return res;
}