import { describe, expect, it } from "vitest";
import { formatTournamentDate, parseTournamentDate } from "@/lib/dates";

describe("fechas del torneo", () => {
  it("interpreta fechas con barras como día/mes/año", () => {
    const parsed = parseTournamentDate("12/06/2026 22:00");

    expect(parsed?.getDate()).toBe(12);
    expect(parsed?.getMonth()).toBe(5);
    expect(formatTournamentDate("12/06/2026 22:00")).toContain("12/06/2026");
  });

  it("mantiene soporte para fechas ISO", () => {
    expect(formatTournamentDate("2026-06-15T17:00:00-04:00")).toMatch(
      /15\/06\/2026/,
    );
  });
});
