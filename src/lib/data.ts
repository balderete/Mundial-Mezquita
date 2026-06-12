import { CSV_CONFIG, hasCsvConfiguration } from "@/config/csv";
import { mockMatches, mockParticipants, mockPredictions } from "@/data/mock-data";
import { fetchCsv, readCsvValue } from "@/lib/csv";
import type {
  Match,
  MatchStatus,
  Participant,
  Prediction,
  Result,
  TournamentData,
} from "@/types";

const RESULTS = new Set<Result>(["L", "E", "V"]);

function asResult(value: string): Result | null {
  const normalized = value.toUpperCase() as Result;
  return RESULTS.has(normalized) ? normalized : null;
}

function asStatus(value: string): MatchStatus {
  return value.toLowerCase() === "finalizado" ? "Finalizado" : "Pendiente";
}

async function loadCsvData(): Promise<TournamentData> {
  const [participantRows, matchRows, predictionRows] = await Promise.all([
    fetchCsv(CSV_CONFIG.participantsUrl),
    fetchCsv(CSV_CONFIG.matchesUrl),
    fetchCsv(CSV_CONFIG.predictionsUrl),
  ]);

  const participants: Participant[] = participantRows
    .map((row) => ({
      id: readCsvValue(row, "ParticipanteID"),
      name: readCsvValue(row, "Nombre"),
    }))
    .filter((participant) => participant.id && participant.name);

  const matches: Match[] = matchRows
    .map((row) => ({
      id: readCsvValue(row, "MatchID"),
      group: readCsvValue(row, "Grupo"),
      date: readCsvValue(row, "Fecha"),
      homeTeam: readCsvValue(row, "Local"),
      awayTeam: readCsvValue(row, "Visitante"),
      actualResult: asResult(readCsvValue(row, "ResultadoReal")),
      status: asStatus(readCsvValue(row, "Estado")),
    }))
    .filter((match) => match.id && match.homeTeam && match.awayTeam);

  const predictions: Prediction[] = predictionRows.flatMap((row) => {
    const prediction = asResult(readCsvValue(row, "Pronostico"));
    const participantId = readCsvValue(row, "ParticipanteID");
    const matchId = readCsvValue(row, "MatchID");

    return participantId && matchId && prediction
      ? [{ participantId, matchId, prediction }]
      : [];
  });

  return { participants, matches, predictions, source: "csv" };
}

export async function getTournamentData(): Promise<TournamentData> {
  if (hasCsvConfiguration) {
    try {
      return await loadCsvData();
    } catch (error) {
      console.error("No fue posible cargar Google Sheets; se usarán mocks.", error);
    }
  }

  return {
    participants: mockParticipants,
    matches: mockMatches,
    predictions: mockPredictions,
    source: "mock",
  };
}
