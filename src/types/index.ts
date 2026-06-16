export type Result = "L" | "E" | "V";
export type MatchStatus = "Pendiente" | "Finalizado";

export interface Participant {
  id: string;
  name: string;
}

export interface Match {
  id: string;
  group: string;
  date: string;
  homeTeam: string;
  awayTeam: string;
  actualResult: Result | null;
  status: MatchStatus;
}

export interface Prediction {
  participantId: string;
  matchId: string;
  prediction: Result;
}

export interface Standing {
  position: number;
  participant: Participant;
  points: number;
  hits: number;
  predictionsCount: number;
  accuracy: number;
}

export interface ParticipantStats {
  participant: Participant;
  points: number;
  hits: number;
  misses: number;
  evaluatedPredictions: number;
  pendingPredictions: number;
  totalPredictions: number;
  accuracy: number;
}

export interface GroupStats {
  group: string;
  totalMatches: number;
  completedMatches: number;
  pendingMatches: number;
  totalPredictions: number;
  hits: number;
  accuracy: number;
}

export interface PredictionDetail {
  match: Match;
  prediction: Prediction | null;
  points: number;
  isCorrect: boolean;
}

export interface ParticipantRankingBreakdown {
  recentMatches: PredictionDetail[];
  upcomingMatches: PredictionDetail[];
}

export interface TournamentData {
  participants: Participant[];
  matches: Match[];
  predictions: Prediction[];
  source: "csv" | "mock";
}
