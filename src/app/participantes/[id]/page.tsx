import Link from "next/link";
import { ArrowLeft, CheckCircle2, Clock3, Target, Trophy } from "lucide-react";
import { notFound } from "next/navigation";
import { Filters } from "@/components/filters";
import { MatchCard } from "@/components/match-card";
import { PageHeading } from "@/components/page-heading";
import { StatsCard } from "@/components/stats-card";
import {
  calculateParticipantStats,
  getParticipantPredictionDetails,
} from "@/domain/scoring";
import { getTournamentData } from "@/lib/data";

interface ParticipantPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ grupo?: string; estado?: string }>;
}

export async function generateMetadata({ params }: ParticipantPageProps) {
  const { id } = await params;
  const data = await getTournamentData();
  const participant = data.participants.find((person) => person.id === id);
  return { title: participant?.name ?? "Participante" };
}

export default async function ParticipantPage({
  params,
  searchParams,
}: ParticipantPageProps) {
  const [{ id }, { grupo = "", estado = "" }] = await Promise.all([
    params,
    searchParams,
  ]);
  const data = await getTournamentData();
  const participant = data.participants.find((person) => person.id === id);
  if (!participant) notFound();

  const stats = calculateParticipantStats(
    participant,
    data.matches,
    data.predictions,
  );
  const groups = [...new Set(data.matches.map((match) => match.group))].sort();
  const details = getParticipantPredictionDetails(
    participant.id,
    data.matches,
    data.predictions,
  ).filter(
    ({ match }) =>
      (!grupo || match.group === grupo) &&
      (!estado || match.status === estado),
  );

  return (
    <>
      <Link
        href="/"
        className="focus-ring mb-5 inline-flex items-center gap-2 rounded-sm text-sm font-bold text-[var(--primary)]"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Volver al ranking
      </Link>
      <PageHeading
        eyebrow="Ficha del participante"
        title={participant.name}
        description="Rendimiento general y detalle partido por partido de todos sus pronósticos."
      />
      <section
        aria-label="Estadísticas del participante"
        className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          label="Puntos"
          value={stats.points}
          detail="Un punto por acierto"
          icon={Trophy}
          tone="gold"
        />
        <StatsCard
          label="Aciertos"
          value={stats.hits}
          detail={`de ${stats.evaluatedPredictions} evaluados`}
          icon={CheckCircle2}
        />
        <StatsCard
          label="Porcentaje"
          value={`${stats.accuracy.toFixed(1)}%`}
          detail={`${stats.misses} pronósticos sin punto`}
          icon={Target}
        />
        <StatsCard
          label="Pendientes"
          value={stats.pendingPredictions}
          detail={`${stats.totalPredictions} pronósticos cargados`}
          icon={Clock3}
          tone="neutral"
        />
      </section>
      <Filters
        action={`/participantes/${participant.id}`}
        fields={[
          {
            name: "grupo",
            label: "Grupo",
            value: grupo,
            options: [
              { value: "", label: "Todos los grupos" },
              ...groups.map((group) => ({
                value: group,
                label: `Grupo ${group}`,
              })),
            ],
          },
          {
            name: "estado",
            label: "Estado",
            value: estado,
            options: [
              { value: "", label: "Todos los estados" },
              { value: "Pendiente", label: "Pendientes" },
              { value: "Finalizado", label: "Finalizados" },
            ],
          },
        ]}
      />
      <section className="grid gap-4 lg:grid-cols-2">
        {details.map(({ match, prediction }) => (
          <MatchCard
            key={match.id}
            match={match}
            selectedPrediction={prediction}
          />
        ))}
      </section>
    </>
  );
}
