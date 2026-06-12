import type { LucideIcon } from "lucide-react";

interface StatsCardProps {
  label: string;
  value: string | number;
  detail?: string;
  icon: LucideIcon;
  tone?: "green" | "gold" | "neutral";
}

const tones = {
  green: "bg-emerald-50 text-emerald-700",
  gold: "bg-amber-50 text-amber-700",
  neutral: "bg-slate-100 text-slate-700",
};

export function StatsCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "green",
}: StatsCardProps) {
  return (
    <article className="panel flex min-h-34 items-start justify-between gap-4 p-5">
      <div>
        <p className="text-sm font-bold text-[var(--muted)]">{label}</p>
        <p className="mt-2 text-3xl font-black tabular-nums">{value}</p>
        {detail && (
          <p className="mt-1 text-xs leading-5 text-[var(--muted)]">{detail}</p>
        )}
      </div>
      <span className={`grid size-10 shrink-0 place-items-center rounded-md ${tones[tone]}`}>
        <Icon size={20} aria-hidden="true" />
      </span>
    </article>
  );
}
