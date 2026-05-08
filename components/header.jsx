"use client";

import { Bell, Search } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export function Header({ title, userType = "patient" }) {
  
  // እንደ ተጠቃሚው አይነት መረጃውን እናዘጋጅ
  let userData = { name: "Rehmet M.", role: "Patient", initial: "RM", color: "bg-[#004a7c]" };

  if (userType === "technician") {
    userData = { name: "Abebe (Lab Tech)", role: "Laboratory Technician", initial: "LT", color: "bg-blue-600" };
  } else if (userType === "doctor") {
    userData = { name: "Dr. Abraham", role: "Medical Doctor", initial: "DR", color: "bg-emerald-600" };
  }

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 pl-4 border-l border-slate-100">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-black text-slate-800 leading-none">{userData.name}</p>
            <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tighter">
              {userData.role}
            </p>
          </div>
          <Avatar className="h-9 w-9 border-2 border-slate-100">
            <AvatarFallback className={cn("text-white text-xs font-black", userData.color)}>
              {userData.initial}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}