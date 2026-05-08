"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, User, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const toggleApproval = (id) => {
  setPatients(patients.map(p => 
    p.id === id ? { ...p, isPublished: !p.isPublished } : p
  ));
  // እዚህ ጋር ለወደፊት "Notification sent to patient" የሚል መልዕክት መጨመር ይቻላል
};

  const handleLogin = (e) => {
    e.preventDefault();
    
    // ዩአርኤሉን ለመለየት እዚህ ጋር ነው ሎጅኩን የምንሰራው
    // አድሚኑ በትክክል ከሞላ ወደ /admin (Dashboard) ይሄዳል
    if (email === "admin@alatyon.com" && password === "admin123") {
      router.push("/admin"); // ይህ ወደ localhost:3000/admin ይወስደዋል
    } else {
      alert("Invalid Staff Credentials!");
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-4">
      {/* ይህ ገጽ በ URL ደረጃ: /admin/login ነው የሚገኘው።
         ታካሚው ደግሞ በ / (Home) ነው የሚገኘው።
      */}
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-[2rem] shadow-2xl shadow-blue-900/5 border border-slate-100">
        
        <div className="text-center space-y-3">
          <div className="mx-auto w-20 h-20 bg-[#004a7c] rounded-3xl flex items-center justify-center shadow-xl shadow-blue-900/20 mb-6 rotate-3 hover:rotate-0 transition-transform duration-300">
            <ShieldCheck className="text-white h-12 w-12" />
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Admin Entry</h1>
          <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">Hospital Staff Only</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6 mt-10">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Official Email
            </label>
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#004a7c] transition-colors" />
              <Input 
                type="email" 
                placeholder="staff@alatyon.com" 
                className="pl-12 h-14 bg-slate-50 border-2 border-transparent focus:border-[#004a7c]/10 focus:bg-white rounded-2xl transition-all outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">
              Staff Secret Key
            </label>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-300 group-focus-within:text-[#004a7c] transition-colors" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-12 h-14 bg-slate-50 border-2 border-transparent focus:border-[#004a7c]/10 focus:bg-white rounded-2xl transition-all outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-14 bg-[#004a7c] hover:bg-[#003a63] text-white font-black rounded-2xl shadow-xl shadow-blue-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-lg"
          >
            Open Dashboard
            <ArrowRight size={20} />
          </Button>
        </form>

        <div className="pt-8 text-center">
          <Link href="/" className="text-xs font-black text-[#004a7c] bg-blue-50 px-6 py-3 rounded-full hover:bg-blue-100 transition-colors">
            ← Switch to Patient Portal
          </Link>
        </div>
      </div>
    </div>
  );
}