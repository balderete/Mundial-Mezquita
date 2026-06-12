import Papa from "papaparse";

type CsvRow = Record<string, string | undefined>;

const normalizeHeader = (value: string) =>
  value.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export function readCsvValue(row: CsvRow, header: string): string {
  const normalizedTarget = normalizeHeader(header);
  const key = Object.keys(row).find(
    (candidate) => normalizeHeader(candidate) === normalizedTarget,
  );
  return key ? row[key]?.trim() ?? "" : "";
}

export async function fetchCsv(url: string): Promise<CsvRow[]> {
  const response = await fetch(url, {
    next: { revalidate: 300 },
  });

  if (!response.ok) {
    throw new Error(`No se pudo leer el CSV (${response.status})`);
  }

  const csv = await response.text();
  const result = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (header) => header.trim(),
  });

  if (result.errors.length > 0) {
    throw new Error(`CSV inválido: ${result.errors[0].message}`);
  }

  return result.data;
}
