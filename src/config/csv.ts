export const CSV_CONFIG = {
  participantsUrl: process.env.PARTICIPANTES_CSV_URL?.trim() ?? "",
  matchesUrl: process.env.PARTIDOS_CSV_URL?.trim() ?? "",
  predictionsUrl: process.env.PRONOSTICOS_CSV_URL?.trim() ?? "",
};

export const hasCsvConfiguration = Object.values(CSV_CONFIG).every(Boolean);
