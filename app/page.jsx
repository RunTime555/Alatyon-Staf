"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Footer } from "@/components/footer";

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

    // Simulate API call - replace with actual backend call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // For demo purposes, accept any credentials
    if (mrn && password) {
      router.push("/dashboard");
    } else {
      setError("Please enter your MRN and password");
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

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 relative z-10">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-primary italic mb-2">
              Welcome Back
            </h1>
            <p className="text-muted-foreground">
              Access your Patient Lab Result Portal
            </p>
          </div>

          {/* Login Card */}
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

              <div className="text-center">
                <Link
                  href="#"
                  className="text-sm text-primary hover:underline font-medium"
                >
                  Forgot Password?
                </Link>
              </div>
            </form>
          </div>

          {/* Support Info */}
          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Need help accessing your account?
            </p>
            <p className="text-sm text-muted-foreground">
              Contact the support desk at{" "}
              <Link href="tel:1-800-ALATYON" className="text-primary font-medium hover:underline">
                1-800-ALATYON
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
