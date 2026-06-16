import { CheckCircle2, Target, Trophy, Users } from "lucide-react";
import { DataSourceNote } from "@/components/data-source-note";
import { Filters } from "@/components/filters";
import { PageHeading } from "@/components/page-heading";
import { RankingTable } from "@/components/ranking-table";
import { StatsCard } from "@/components/stats-card";
import {
  calculateStandings,
  getParticipantRankingBreakdown,
} from "@/domain/scoring";
import { getTournamentData } from "@/lib/data";

interface HomeProps {
  searchParams: Promise<{ grupo?: string }>;
}

export default async function Home({ searchParams }: HomeProps) {
  const { grupo = "" } = await searchParams;
  const data = await getTournamentData();
  const groups = [...new Set(data.matches.map((match) => match.group))].sort();
  const filteredMatches = grupo
    ? data.matches.filter((match) => match.group === grupo)
    : data.matches;
  const filteredMatchIds = new Set(filteredMatches.map((match) => match.id));
  const filteredPredictions = data.predictions.filter((prediction) =>
    filteredMatchIds.has(prediction.matchId),
  );
  const standings = calculateStandings(
    data.participants,
    filteredMatches,
    filteredPredictions,
  );
  const breakdowns = Object.fromEntries(
    standings.map((standing) => [
      standing.participant.id,
      getParticipantRankingBreakdown(
        standing.participant.id,
        filteredMatches,
        filteredPredictions,
      ),
    ]),
  );
  const leader = standings[0];
  const completedMatches = filteredMatches.filter(
    (match) => match.status === "Finalizado",
  ).length;
  const totalHits = standings.reduce((sum, standing) => sum + standing.hits, 0);
  const totalEvaluated = standings.reduce(
    (sum, standing) => sum + standing.predictionsCount,
    0,
  );
  const globalAccuracy = totalEvaluated
    ? (totalHits / totalEvaluated) * 100
    : 0;

  return (
    <>
      <PageHeading
        eyebrow="Tabla general"
        title="El camino a la gloria"
        description="Todos los pronósticos, aciertos y posiciones del torneo en un solo lugar."
      />
      <DataSourceNote source={data.source} />
      <section
        aria-label="Resumen del torneo"
        className="mb-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      >
        <StatsCard
          label="Líder actual"
          value={leader?.participant.name ?? "Sin datos"}
          detail={leader ? `${leader.points} puntos` : undefined}
          icon={Trophy}
          tone="gold"
        />
        <StatsCard
          label="Participantes"
          value={data.participants.length}
          detail="En competencia"
          icon={Users}
        />
        <StatsCard
          label="Partidos jugados"
          value={completedMatches}
          detail={`de ${filteredMatches.length} en la selección`}
          icon={CheckCircle2}
          tone="neutral"
        />
        <StatsCard
          label="Acierto global"
          value={`${globalAccuracy.toFixed(1)}%`}
          detail={`${totalHits} pronósticos correctos`}
          icon={Target}
        />
      </section>
      <Filters
        action="/"
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
        ]}
      />
      <RankingTable standings={standings} breakdowns={breakdowns} />
    </>
  );
}
