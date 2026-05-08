"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPassword() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-100 via-background to-cyan-50/30">
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-xl shadow-lg border border-border p-8 text-center">
            {!isSubmitted ? (
              <>
                <h1 className="text-2xl font-bold text-primary mb-2">Reset Password</h1>
                <p className="text-muted-foreground mb-6">Enter your email to receive a reset link.</p>
                <form onSubmit={(e) => { e.preventDefault(); setIsSubmitted(true); }} className="space-y-6 text-left">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="name@example.com" className="pl-10 h-12 bg-muted border-0" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12">Send Reset Link</Button>
                </form>
              </>
            ) : (
              <div className="py-4">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                  <Mail className="h-8 w-8" />
                </div>
                <h2 className="text-xl font-bold mb-2">Check your email</h2>
                <p className="text-muted-foreground mb-6">We've sent a link to reset your password.</p>
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-border/50 text-center">
               <Link href="/" className="text-sm text-primary hover:underline inline-flex items-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
            </div>
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