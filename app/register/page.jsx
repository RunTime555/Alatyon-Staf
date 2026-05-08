"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-background to-cyan-50/30">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary italic mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join the Alatyon Patient Portal</p>
          </div>

          <div className="bg-card rounded-xl shadow-lg border border-border p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="name" placeholder="Enter Full Name" className="pl-10 h-12 bg-muted border-0" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="email" type="email" placeholder="name@example.com" className="pl-10 h-12 bg-muted border-0" required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input id="password" type="password" placeholder="••••••••" className="pl-10 h-12 bg-muted border-0" required />
                </div>
              </div>

              <Button type="submit" className="w-full h-12 font-medium" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Register Now"}
              </Button>

              <div className="text-center pt-4">
                <Link href="/" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <footer className="w-full py-6 border-t border-border bg-background text-center">
        <p className="text-sm text-muted-foreground">
          © 2026 Alatyon Hospital. All rights reserved.
        </p>
      </footer>
    </div>
  );
}