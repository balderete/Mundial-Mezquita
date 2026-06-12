import type { Match, Participant, Prediction } from "@/types";

export const mockParticipants: Participant[] = [
  { id: "P01", name: "Ana Torres" },
  { id: "P02", name: "Bruno Silva" },
  { id: "P03", name: "Carla Méndez" },
  { id: "P04", name: "Diego Ruiz" },
  { id: "P05", name: "Elena Costa" },
  { id: "P06", name: "Facundo Paz" },
];

export const mockMatches: Match[] = [
  {
    id: "M01",
    group: "A",
    date: "2026-06-11T16:00:00-04:00",
    homeTeam: "México",
    awayTeam: "Sudáfrica",
    actualResult: "L",
    status: "Finalizado",
  },
  {
    id: "M02",
    group: "A",
    date: "2026-06-11T22:00:00-04:00",
    homeTeam: "Corea del Sur",
    awayTeam: "Dinamarca",
    actualResult: "E",
    status: "Finalizado",
  },
  {
    id: "M03",
    group: "B",
    date: "2026-06-12T15:00:00-07:00",
    homeTeam: "Canadá",
    awayTeam: "Suiza",
    actualResult: "V",
    status: "Finalizado",
  },
  {
    id: "M04",
    group: "B",
    date: "2026-06-12T21:00:00-04:00",
    homeTeam: "Brasil",
    awayTeam: "Marruecos",
    actualResult: "L",
    status: "Finalizado",
  },
  {
    id: "M05",
    group: "C",
    date: "2026-06-13T18:00:00-05:00",
    homeTeam: "Argentina",
    awayTeam: "Japón",
    actualResult: null,
    status: "Pendiente",
  },
  {
    id: "M06",
    group: "C",
    date: "2026-06-14T14:00:00-07:00",
    homeTeam: "España",
    awayTeam: "Uruguay",
    actualResult: null,
    status: "Pendiente",
  },
  {
    id: "M07",
    group: "D",
    date: "2026-06-15T17:00:00-04:00",
    homeTeam: "Francia",
    awayTeam: "Senegal",
    actualResult: null,
    status: "Pendiente",
  },
  {
    id: "M08",
    group: "D",
    date: "2026-06-16T20:00:00-05:00",
    homeTeam: "Estados Unidos",
    awayTeam: "Alemania",
    actualResult: null,
    status: "Pendiente",
  },
];

const choices = ["L", "E", "V"] as const;

export const mockPredictions: Prediction[] = mockParticipants.flatMap(
  (participant, participantIndex) =>
    mockMatches.map((match, matchIndex) => ({
      participantId: participant.id,
      matchId: match.id,
      prediction: choices[(participantIndex * 2 + matchIndex) % choices.length],
    })),
);
