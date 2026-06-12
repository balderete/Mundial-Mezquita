import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Standing } from "@/types";

function Position({ position }: { position: number }) {
  const colors = [
    "bg-amber-100 text-amber-700",
    "bg-slate-200 text-slate-700",
    "bg-orange-100 text-orange-700",
  ];

  return (
    <span
      aria-label={`Puesto ${position}`}
      className={`grid size-8 place-items-center rounded-full text-sm font-black tabular-nums ${
        colors[position - 1] ?? "bg-[var(--surface-muted)] text-[var(--muted)]"
      }`}
    >
      {position}
    </span>
  );
}

export function RankingTable({ standings }: { standings: Standing[] }) {
  if (!standings.length) {
    return (
      <div className="panel p-8 text-center text-[var(--muted)]">
        No hay participantes para los filtros seleccionados.
      </div>
    );
  }

  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-170 border-collapse text-left">
          <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Pos.</th>
              <th className="px-4 py-3">Participante</th>
              <th className="px-4 py-3 text-center">Puntos</th>
              <th className="px-4 py-3 text-center">Aciertos</th>
              <th className="px-4 py-3 text-center">Pronósticos</th>
              <th className="px-4 py-3 text-center">% acierto</th>
              <th className="px-4 py-3" aria-label="Ver detalle" />
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {standings.map((standing) => (
              <tr
                key={standing.participant.id}
                className="transition hover:bg-emerald-50/45"
              >
                <td className="px-4 py-4">
                  <Position position={standing.position} />
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/participantes/${standing.participant.id}`}
                    className="focus-ring rounded-sm font-extrabold hover:text-[var(--primary)]"
                  >
                    {standing.participant.name}
                  </Link>
                </td>
                <td className="px-4 py-4 text-center text-lg font-black tabular-nums">
                  {standing.points}
                </td>
                <td className="px-4 py-4 text-center font-semibold tabular-nums">
                  {standing.hits}
                </td>
                <td className="px-4 py-4 text-center tabular-nums text-[var(--muted)]">
                  {standing.predictionsCount}
                </td>
                <td className="px-4 py-4 text-center font-semibold tabular-nums">
                  {standing.accuracy.toFixed(1)}%
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/participantes/${standing.participant.id}`}
                    aria-label={`Ver detalle de ${standing.participant.name}`}
                    className="focus-ring grid size-9 place-items-center rounded-md text-[var(--primary)] hover:bg-emerald-100"
                  >
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
      </table>
    </div>
  );
}
