// app/api/auth/logout/route.js
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const cookieStore = await cookies();
    
    // 1. የኩኪውን ስም እናረጋግጣለን
    const token = cookieStore.get("staff_token")?.value;

    // 2. እዚህ ቦታ ላይ በ lib/auth.js ውስጥ 'blacklistToken' የሚባል ፋንክሽን ካለህ 
    //    await blacklistToken(token) ብለህ መጠቀም ትችላለህ። 
    //    ካልሆነ ግን በቀጥታ ኩኪውን መሰረዝ በቂ ነው።

    // 3. ወደ login ገጽ የሚወስድ ምላሽ እንፈጥራለን
    const res = NextResponse.json({ success: true, message: "Logged out successfully" });

    // 4. ኩኪውን እናጠፋለን
    res.cookies.delete("staff_token");

    return res;
  } catch (error) {
    console.error("LOGOUT_ERROR:", error);
    return NextResponse.json({ success: false, error: "Logout failed" }, { status: 500 });
  }
}
