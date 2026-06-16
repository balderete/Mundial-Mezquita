import { describe, expect, it } from "vitest";
import { mockMatches, mockParticipants, mockPredictions } from "@/data/mock-data";
import {
  calculateGroupStats,
  calculatePredictionPoints,
  calculateStandings,
  getParticipantRankingBreakdown,
  getParticipantsWhoHitMatch,
} from "@/domain/scoring";

describe("reglas de puntuación", () => {
  it("suma un punto cuando el pronóstico coincide", () => {
    expect(
      calculatePredictionPoints(mockMatches[0], {
        participantId: "P01",
        matchId: "M01",
        prediction: "L",
      }),
    ).toBe(1);
  });

  it("no puntúa partidos pendientes aunque el resultado coincida", () => {
    expect(
      calculatePredictionPoints(mockMatches[4], {
        participantId: "P01",
        matchId: "M05",
        prediction: "L",
      }),
    ).toBe(0);
  });

  it("genera ranking, estadísticas de grupo y aciertos por partido", () => {
    const standings = calculateStandings(
      mockParticipants,
      mockMatches,
      mockPredictions,
    );
    expect(standings).toHaveLength(mockParticipants.length);
    expect(standings.map(({ position }) => position)).toEqual([1, 2, 3, 4, 5, 6]);
    expect(calculateGroupStats(mockMatches, mockPredictions)).toHaveLength(4);
    expect(
      getParticipantsWhoHitMatch(
        mockMatches[0],
        mockParticipants,
        mockPredictions,
      ).length,
    ).toBeGreaterThan(0);
  });

  it("devuelve últimos y próximos partidos para el desglose del ranking", () => {
    const breakdown = getParticipantRankingBreakdown(
      "P01",
      mockMatches,
      mockPredictions,
    );

    expect(breakdown.recentMatches).toHaveLength(3);
    expect(breakdown.upcomingMatches).toHaveLength(3);
    expect(
      breakdown.recentMatches.every(
        ({ match }) => match.status === "Finalizado",
      ),
    ).toBe(true);
    expect(
      breakdown.upcomingMatches.every(
        ({ match }) => match.status === "Pendiente",
      ),
    ).toBe(true);
  });
});
