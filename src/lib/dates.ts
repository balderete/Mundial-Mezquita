const DAY_FIRST_DATE_PATTERN =
  /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})(?:[ T](\d{1,2}):(\d{2}))?/;

export function parseTournamentDate(value: string): Date | null {
  const trimmed = value.trim();
  const dayFirstMatch = trimmed.match(DAY_FIRST_DATE_PATTERN);

  if (dayFirstMatch) {
    const [, day, month, year, hour = "0", minute = "0"] = dayFirstMatch;
    const normalizedYear = year.length === 2 ? `20${year}` : year;
    const parsed = new Date(
      Number(normalizedYear),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
    );

    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getTournamentDateTime(value: string): number {
  return parseTournamentDate(value)?.getTime() ?? 0;
}

export function formatTournamentDate(value: string): string {
  const date = parseTournamentDate(value);
  if (!date) return value;

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}
