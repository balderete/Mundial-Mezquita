import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import type {
  ParticipantRankingBreakdown,
  PredictionDetail,
  Standing,
} from "@/types";
import { formatTournamentDate } from "@/lib/dates";

const resultLabels = {
  L: "Local",
  E: "Empate",
  V: "Visitante",
};

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

function DetailItem({
  detail,
  mode,
}: {
  detail: PredictionDetail;
  mode: "recent" | "upcoming";
}) {
  const prediction = detail.prediction?.prediction
    ? resultLabels[detail.prediction.prediction]
    : "Sin pronóstico";
  const outcome =
    mode === "recent"
      ? detail.isCorrect
        ? "Acierto"
        : "Sin punto"
      : "Pendiente";

  return (
    <li className="rounded-md border border-[var(--line)] bg-white p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-black">
            {detail.match.homeTeam} vs {detail.match.awayTeam}
          </p>
          <p className="mt-1 text-xs font-semibold text-[var(--muted)]">
            {formatTournamentDate(detail.match.date)} · Grupo {detail.match.group}
          </p>
        </div>
        <span
          className={`shrink-0 rounded-full px-2 py-1 text-[0.7rem] font-black ${
            detail.isCorrect
              ? "bg-emerald-50 text-emerald-700"
              : "bg-[var(--surface-muted)] text-[var(--muted)]"
          }`}
        >
          {outcome}
        </span>
      </div>
      <p className="mt-2 text-xs text-[var(--muted)]">
        Pronóstico: <strong className="text-[var(--foreground)]">{prediction}</strong>
        {mode === "recent" && detail.match.actualResult ? (
          <>
            {" "}
            · Resultado:{" "}
            <strong className="text-[var(--foreground)]">
              {resultLabels[detail.match.actualResult]}
            </strong>
          </>
        ) : null}
      </p>
    </li>
  );
}

function BreakdownPanel({
  participantName,
  participantId,
  breakdown,
}: {
  participantName: string;
  participantId: string;
  breakdown: ParticipantRankingBreakdown;
}) {
  return (
    <div className="border-t border-[var(--line)] bg-emerald-50/45 p-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <section>
          <h3 className="mb-2 text-xs font-black uppercase tracking-[0.07em] text-[var(--primary)]">
            Últimos 3 partidos
          </h3>
          {breakdown.recentMatches.length ? (
            <ul className="grid gap-2">
              {breakdown.recentMatches.map((detail) => (
                <DetailItem
                  key={detail.match.id}
                  detail={detail}
                  mode="recent"
                />
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed border-[var(--line)] bg-white p-3 text-sm text-[var(--muted)]">
              Todavía no tiene partidos finalizados en esta selección.
            </p>
          )}
        </section>
        <section>
          <h3 className="mb-2 text-xs font-black uppercase tracking-[0.07em] text-[var(--primary)]">
            Próximos 3 pronósticos
          </h3>
          {breakdown.upcomingMatches.length ? (
            <ul className="grid gap-2">
              {breakdown.upcomingMatches.map((detail) => (
                <DetailItem
                  key={detail.match.id}
                  detail={detail}
                  mode="upcoming"
                />
              ))}
            </ul>
          ) : (
            <p className="rounded-md border border-dashed border-[var(--line)] bg-white p-3 text-sm text-[var(--muted)]">
              No quedan próximos pronósticos cargados en esta selección.
            </p>
          )}
        </section>
      </div>
      <Link
        href={`/participantes/${participantId}`}
        className="focus-ring mt-4 flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-center text-sm font-black text-white hover:bg-[var(--primary-dark)]"
      >
        Ver historial completo de {participantName}
        <ArrowRight size={17} aria-hidden="true" />
      </Link>
    </div>
  );
}

export function RankingTable({
  standings,
  breakdowns,
}: {
  standings: Standing[];
  breakdowns: Record<string, ParticipantRankingBreakdown>;
}) {
  if (!standings.length) {
    return (
      <div className="panel p-8 text-center text-[var(--muted)]">
        No hay participantes para los filtros seleccionados.
      </div>
    );
  }

  return (
    <section aria-label="Ranking de participantes" className="grid gap-3">
      <div className="panel hidden grid-cols-[72px_1.4fr_repeat(4,1fr)_48px] items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-[0.06em] text-[var(--muted)] md:grid">
        <span>Pos.</span>
        <span>Participante</span>
        <span className="text-center">Puntos</span>
        <span className="text-center">Aciertos</span>
        <span className="text-center">Pronósticos</span>
        <span className="text-center">% acierto</span>
        <span aria-hidden="true" />
      </div>

      {standings.map((standing) => (
        <details
          key={standing.participant.id}
          className="panel overflow-hidden group"
        >
          <summary className="focus-ring grid cursor-pointer list-none grid-cols-[auto_1fr_auto] items-center gap-3 p-4 marker:hidden md:grid-cols-[72px_1.4fr_repeat(4,1fr)_48px] md:px-4">
            <Position position={standing.position} />
            <span className="min-w-0">
              <span className="block truncate text-lg font-black md:text-base">
                {standing.participant.name}
              </span>
              <span className="mt-2 grid grid-cols-3 gap-2 text-xs font-bold text-[var(--muted)] md:hidden">
                <span>
                  <strong className="block text-base text-[var(--foreground)]">
                    {standing.points}
                  </strong>
                  pts
                </span>
                <span>
                  <strong className="block text-base text-[var(--foreground)]">
                    {standing.predictionsCount}
                  </strong>
                  pronósticos
                </span>
                <span>
                  <strong className="block text-base text-[var(--foreground)]">
                    {standing.accuracy.toFixed(0)}%
                  </strong>
                  acierto
                </span>
              </span>
            </span>
            <span className="hidden text-center text-lg font-black tabular-nums md:block">
              {standing.points}
            </span>
            <span className="hidden text-center font-semibold tabular-nums md:block">
              {standing.hits}
            </span>
            <span className="hidden text-center tabular-nums text-[var(--muted)] md:block">
              {standing.predictionsCount}
            </span>
            <span className="hidden text-center font-semibold tabular-nums md:block">
              {standing.accuracy.toFixed(1)}%
            </span>
            <span className="grid size-9 place-items-center rounded-md bg-[var(--surface-muted)] text-[var(--primary)] transition group-open:rotate-180">
              <ChevronDown size={18} aria-hidden="true" />
            </span>
          </summary>
          <BreakdownPanel
            participantName={standing.participant.name}
            participantId={standing.participant.id}
            breakdown={breakdowns[standing.participant.id]}
          />
        </details>
      ))}
    </section>
  );
}
