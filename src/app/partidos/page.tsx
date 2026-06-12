import { DataSourceNote } from "@/components/data-source-note";
import { Filters } from "@/components/filters";
import { MatchCard } from "@/components/match-card";
import { PageHeading } from "@/components/page-heading";
import { getParticipantsWhoHitMatch } from "@/domain/scoring";
import { getTournamentData } from "@/lib/data";

interface MatchesPageProps {
  searchParams: Promise<{
    grupo?: string;
    estado?: string;
    participante?: string;
  }>;
}

export const metadata = {
  title: "Partidos",
};

export default async function MatchesPage({
  searchParams,
}: MatchesPageProps) {
  const { grupo = "", estado = "", participante = "" } = await searchParams;
  const data = await getTournamentData();
  const groups = [...new Set(data.matches.map((match) => match.group))].sort();
  const matches = data.matches.filter(
    (match) =>
      (!grupo || match.group === grupo) &&
      (!estado || match.status === estado),
  );

  return (
    <>
      <PageHeading
        eyebrow="Calendario y resultados"
        title="Todos los partidos"
        description="Consultá el estado, el resultado real, el pronóstico de cada participante y quiénes sumaron."
      />
      <DataSourceNote source={data.source} />
      <Filters
        action="/partidos"
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
      {matches.length ? (
        <section className="grid gap-4 lg:grid-cols-2">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              winners={getParticipantsWhoHitMatch(
                match,
                data.participants,
                data.predictions,
              )}
              selectedPrediction={
                participante
                  ? data.predictions.find(
                      (prediction) =>
                        prediction.matchId === match.id &&
                        prediction.participantId === participante,
                    )
                  : undefined
              }
            />
          ))}
        </section>
      ) : (
        <div className="panel p-10 text-center text-[var(--muted)]">
          No hay partidos para los filtros seleccionados.
        </div>
      )}
    </>
  );
}
