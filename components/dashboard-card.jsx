"use client";

import { cn } from "@/lib/utils";

export function DashboardCard({ children, className, variant }) {
  return (
    <div className={cn(
      "bg-card p-6 rounded-xl border shadow-sm",
      variant === "highlight" && "bg-[#004a7c] text-white border-[#004a7c]",
      className
    )}>
      {children}
    </div>
  );
}

export function MetricCard({ label, value, icon }) {
  return (
    <div className="bg-card p-6 rounded-xl border shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs text-muted-foreground mb-1">{label}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
        {icon}
      </div>
    </div>
  );
}