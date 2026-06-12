import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import type { ParticipantStats } from "@/types";

export function ParticipantCard({ stats }: { stats: ParticipantStats }) {
  return (
    <article className="panel p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-lg font-black">{stats.participant.name}</p>
          <p className="mt-1 text-sm text-[var(--muted)]">
            {stats.hits} aciertos de {stats.evaluatedPredictions}
          </p>
        </div>
        <span className="grid size-10 place-items-center rounded-md bg-emerald-50 text-emerald-700">
          <Target size={20} aria-hidden="true" />
        </span>
      </div>
      <div className="my-5 h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
        <div
          className="h-full rounded-full bg-[var(--primary)]"
          style={{ width: `${stats.accuracy}%` }}
        />
      </div>
      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-black tabular-nums">{stats.points} pts</p>
          <p className="text-xs text-[var(--muted)]">
            {stats.accuracy.toFixed(1)}% de acierto
          </p>
        </div>
        <Link
          href={`/participantes/${stats.participant.id}`}
          aria-label={`Ver detalle de ${stats.participant.name}`}
          className="focus-ring grid size-10 place-items-center rounded-md bg-[var(--foreground)] text-white hover:bg-[var(--primary)]"
        >
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}
