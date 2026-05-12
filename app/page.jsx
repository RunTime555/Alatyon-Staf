"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Lock, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const router = useRouter();
  const [mrn, setMrn] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // ወደ ፈጠርነው API ጥያቄ እንልካለን
      // ማስታወሻ: ባክኢንዱ 'email' ስለሚጠብቅ mrn-ን እንደ email እንልካለን
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: mrn, 
          password: password 
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // ሎጊን ከተሳካ ቶከኑ በኩኪ ውስጥ ተቀምጧል፣ ወደ ዳሽቦርድ እንልካለን
        router.push("/dashboard");
      } else {
        // ስህተት ካለ እናሳያለን
        setError(data.error || "Login failed. Please check your credentials.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Server connection failed. Is the backend running?");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-background to-cyan-50/30">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary italic mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Access your Patient Lab Result Portal
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="mrn" className="text-sm font-medium text-foreground">
                  Medical Record Number (MRN)
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="mrn"
                    type="text"
                    placeholder="Enter your MRN"
                    value={mrn}
                    onChange={(e) => setMrn(e.target.value)}
                    className="pl-10 h-12 bg-muted border-0"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-foreground">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 bg-muted border-0"
                    required
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Login"}
              </Button>

              <div className="text-center space-y-4">
                <Link
                  href="/forgot-password"
                  className="text-sm text-primary hover:underline font-medium block"
                >
                  Forgot Password?
                </Link>

                <div className="pt-2">
                  <p className="text-sm text-muted-foreground mb-1">
                    Don't have an account?
                  </p>
                  <Link
                    href="/register"
                    className="inline-flex items-center gap-2 text-sm text-primary font-bold hover:text-primary/80 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    Create an Account
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 mt-auto border-t border-border bg-background/50 backdrop-blur-sm text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Alatyon Hospital. All rights reserved.
        </p>
      </footer>
    </div>
  );
}