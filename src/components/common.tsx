import type { ReactNode } from "react";
import { FlaskConical, Info } from "lucide-react";

export function PageHeader({ title, subtitle, icon, children }: { title: string; subtitle?: string; icon?: ReactNode; children?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-1 grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary text-primary">{icon}</div>}
        <div>
          <h1 className="text-2xl font-semibold sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
        </div>
      </div>
      {children}
    </div>
  );
}

export function DemoBadge({ label = "Sample data" }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-warning/25 px-2.5 py-0.5 text-xs font-semibold text-warning-foreground">
      <FlaskConical className="h-3 w-3" /> {label}
    </span>
  );
}

export function Notice({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "warn" }) {
  return (
    <div className={`flex gap-3 rounded-xl border p-4 text-sm ${tone === "warn" ? "border-warning/50 bg-warning/10" : "border-primary/20 bg-secondary/60"}`}>
      <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
      <div>{children}</div>
    </div>
  );
}

export function Panel({ title, action, children, className = "" }: { title?: ReactNode; action?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-2xl border bg-card p-5 shadow-card ${className}`}>
      {(title || action) && (
        <div className="mb-4 flex items-center justify-between gap-2">
          {title && <h2 className="text-lg font-semibold">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function CropArt({ emoji, size = "md" }: { emoji: string; size?: "sm" | "md" | "lg" }) {
  const s = size === "lg" ? "h-24 w-24 text-6xl" : size === "sm" ? "h-10 w-10 text-2xl" : "h-16 w-16 text-4xl";
  return <div aria-hidden className={`grid shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-secondary to-accent/60 ${s}`}>{emoji}</div>;
}

export const inputCls = "w-full rounded-lg border border-input bg-card px-3 py-2.5 text-base focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/30";
