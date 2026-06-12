import type { GroupStats } from "@/types";

export function GroupStatsTable({ stats }: { stats: GroupStats[] }) {
  return (
    <div className="panel overflow-x-auto">
      <table className="w-full min-w-160 text-left">
        <thead className="bg-[var(--surface-muted)] text-xs uppercase tracking-[0.06em] text-[var(--muted)]">
          <tr>
            <th className="px-4 py-3">Grupo</th>
            <th className="px-4 py-3 text-center">Partidos</th>
            <th className="px-4 py-3 text-center">Finalizados</th>
            <th className="px-4 py-3 text-center">Aciertos</th>
            <th className="px-4 py-3 text-center">% acierto</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[var(--line)]">
          {stats.map((group) => (
            <tr key={group.group}>
              <td className="px-4 py-4 font-black">Grupo {group.group}</td>
              <td className="px-4 py-4 text-center tabular-nums">
                {group.totalMatches}
              </td>
              <td className="px-4 py-4 text-center tabular-nums">
                {group.completedMatches}
              </td>
              <td className="px-4 py-4 text-center font-bold tabular-nums">
                {group.hits}
              </td>
              <td className="px-4 py-4 text-center font-bold tabular-nums text-[var(--primary)]">
                {group.accuracy.toFixed(1)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
