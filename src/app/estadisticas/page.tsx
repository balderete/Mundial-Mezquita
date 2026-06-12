import { BarChart3, CheckCircle2, Percent, Users } from "lucide-react";
import { DataSourceNote } from "@/components/data-source-note";
import { Filters } from "@/components/filters";
import { GroupStatsTable } from "@/components/group-stats-table";
import { PageHeading } from "@/components/page-heading";
import { ParticipantCard } from "@/components/participant-card";
import { StatsCard } from "@/components/stats-card";
import {
  calculateGroupStats,
  calculateParticipantStats,
} from "@/domain/scoring";
import { getTournamentData } from "@/lib/data";

interface StatsPageProps {
  searchParams: Promise<{ grupo?: string; participante?: string }>;
}

export const metadata = {
  title: "Estadísticas",
};

export default async function StatsPage({ searchParams }: StatsPageProps) {
  const { grupo = "", participante = "" } = await searchParams;
  const data = await getTournamentData();
  const groups = [...new Set(data.matches.map((match) => match.group))].sort();
  const matches = grupo
    ? data.matches.filter((match) => match.group === grupo)
    : data.matches;
  const matchIds = new Set(matches.map((match) => match.id));
  const predictions = data.predictions.filter((prediction) =>
    matchIds.has(prediction.matchId),
  );
  const participants = participante
    ? data.participants.filter((person) => person.id === participante)
    : data.participants;
  const participantStats = participants
    .map((person) => calculateParticipantStats(person, matches, predictions))
    .sort((a, b) => b.points - a.points || b.accuracy - a.accuracy);
  const groupStats = calculateGroupStats(matches, predictions);
  const completed = matches.filter(
    (match) => match.status === "Finalizado",
  ).length;
  const totalHits = participantStats.reduce((sum, stat) => sum + stat.hits, 0);
  const evaluated = participantStats.reduce(
    (sum, stat) => sum + stat.evaluatedPredictions,
    0,
  );

  return (
    <>
      <PageHeading
        eyebrow="Radiografía del torneo"
        title="Estadísticas"
        description="Compará rendimientos, revisá la precisión global y descubrí qué grupos fueron más predecibles."
      />
      <DataSourceNote source={data.source} />
      <Filters
        action="/estadisticas"
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
            name: "participante",
            label: "Participante",
            value: participante,
            options: [
              { value: "", label: "Todos los participantes" },
              ...data.participants.map((person) => ({
                value: person.id,
                label: person.name,
              })),
            ],
          },
        ]}
      />
      <section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Partidos analizados"
          value={completed}
          detail={`de ${matches.length} partidos`}
          icon={BarChart3}
          tone="neutral"
        />
        <StatsCard
          label="Pronósticos evaluados"
          value={evaluated}
          icon={Users}
        />
        <StatsCard
          label="Aciertos totales"
          value={totalHits}
          icon={CheckCircle2}
        />
        <StatsCard
          label="Precisión global"
          value={`${(evaluated ? (totalHits / evaluated) * 100 : 0).toFixed(1)}%`}
          icon={Percent}
          tone="gold"
        />
      </section>

      <section className="mb-9">
        <h2 className="mb-4 text-xl font-black">Rendimiento por participante</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {participantStats.map((stats) => (
            <ParticipantCard key={stats.participant.id} stats={stats} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-black">Rendimiento por grupo</h2>
        <GroupStatsTable stats={groupStats} />
      </section>
    </>
  );
}
