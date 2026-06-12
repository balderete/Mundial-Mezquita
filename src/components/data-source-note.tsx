import { Database } from "lucide-react";

export function DataSourceNote({ source }: { source: "csv" | "mock" }) {
  if (source === "csv") return null;

  return (
    <div className="mb-6 flex items-start gap-3 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <Database className="mt-0.5 shrink-0" size={17} aria-hidden="true" />
      <p>
        Vista de demostración con datos mock. Configurá las tres URLs CSV para
        mostrar los datos reales del torneo.
      </p>
    </div>
  );
}
