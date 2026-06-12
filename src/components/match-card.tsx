import { CalendarDays, Check, Clock3, Users } from "lucide-react";
import type { Match, Participant, Prediction } from "@/types";

const resultLabels = {
  L: "Ganó local",
  E: "Empate",
  V: "Ganó visitante",
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

interface MatchCardProps {
  match: Match;
  winners?: Participant[];
  selectedPrediction?: Prediction | null;
}

export function MatchCard({
  match,
  winners = [],
  selectedPrediction,
}: MatchCardProps) {
  const isFinal = match.status === "Finalizado";
  const didHit =
    isFinal &&
    match.actualResult &&
    selectedPrediction?.prediction === match.actualResult;

  return (
    <article className="panel overflow-hidden">
      <div className="flex items-center justify-between border-b border-[var(--line)] bg-[var(--surface-muted)] px-4 py-3">
        <span className="text-xs font-black uppercase tracking-[0.07em] text-[var(--primary)]">
          Grupo {match.group}
        </span>
        <span
          className={`flex items-center gap-1.5 text-xs font-bold ${
            isFinal ? "text-emerald-700" : "text-[var(--muted)]"
          }`}
        >
          {isFinal ? <Check size={14} /> : <Clock3 size={14} />}
          {match.status}
        </span>
      </div>
      <div className="p-5">
        <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
          <CalendarDays size={15} aria-hidden="true" />
          <time dateTime={match.date}>{formatDate(match.date)}</time>
        </div>
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
          <p className="text-right text-base font-black">{match.homeTeam}</p>
          <span className="grid size-10 place-items-center rounded-md border border-[var(--line)] bg-white text-xs font-black text-[var(--muted)]">
            VS
          </span>
          <p className="text-base font-black">{match.awayTeam}</p>
        </div>
        <div className="mt-5 grid gap-2 border-t border-[var(--line)] pt-4 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-[var(--muted)]">Resultado</span>
            <strong>
              {match.actualResult ? resultLabels[match.actualResult] : "A definir"}
            </strong>
          </div>
          {selectedPrediction && (
            <div className="flex justify-between gap-4">
              <span className="text-[var(--muted)]">Pronóstico elegido</span>
              <strong className={didHit ? "text-emerald-700" : undefined}>
                {resultLabels[selectedPrediction.prediction]}
                {isFinal ? (didHit ? " · Acierto" : " · Sin punto") : ""}
              </strong>
            </div>
          )}
          {isFinal && (
            <div className="flex items-start justify-between gap-4">
              <span className="flex items-center gap-1.5 text-[var(--muted)]">
                <Users size={15} aria-hidden="true" />
                Acertaron
              </span>
              <strong className="max-w-[65%] text-right">
                {winners.length
                  ? winners.map((participant) => participant.name).join(", ")
                  : "Nadie"}
              </strong>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
