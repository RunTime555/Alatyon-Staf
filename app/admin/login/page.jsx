"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // በሮል መሰረት ወደ ተለያዩ ዳሽቦርዶች መላክ
        if (data.role === 'Doctor') {
          router.push("/admin/doctor-dashboard");
        } else if (data.role === 'LabTech') {
          router.push("/admin/lab-dashboard");
        } else {
          // Admin ከሆነ ወደ ዋናው አድሚን ገጽ
          router.push("/admin/dashboard");
        }
      } else {
        setError(data.error || "Invalid Admin Credentials");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Server connection failed.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Portal</h1>
          <p className="text-slate-500 text-sm">Staff only access</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-6">
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label>Staff Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="email" 
                placeholder="doctor@alatyon.com" 
                className="pl-10" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input 
                type="password" 
                placeholder="••••••••" 
                className="pl-10" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <Button type="submit" className="w-full h-12" disabled={isLoading}>
            {isLoading ? "Authenticating..." : "Login to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
}