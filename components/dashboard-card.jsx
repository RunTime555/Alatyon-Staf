import { cn } from "@/lib/utils";

export function DashboardCard({
  children,
  className,
  variant = "default",
}) {
  return (
    <div
      className={cn(
        "rounded-xl p-5 transition-shadow",
        variant === "default" && "bg-card border border-border shadow-sm",
        variant === "highlight" && "bg-primary text-primary-foreground shadow-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function MetricCard({
  label,
  value,
  unit,
  icon,
  badge,
  subtitle,
  className,
}) {
  return (
    <DashboardCard className={cn("flex flex-col", className)}>
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        {icon && <span className="text-primary">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
      </div>
      {badge && <div className="mt-2">{badge}</div>}
      {subtitle && (
        <p className="text-xs text-muted-foreground mt-2">{subtitle}</p>
      )}
    </DashboardCard>
  );
}
