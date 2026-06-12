import { Filter } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterField {
  name: string;
  label: string;
  value?: string;
  options: FilterOption[];
}

export function Filters({
  action,
  fields,
}: {
  action: string;
  fields: FilterField[];
}) {
  return (
    <form
      action={action}
      className="panel mb-6 grid gap-3 p-4 sm:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]"
    >
      {fields.map((field) => (
        <label key={field.name} className="grid gap-1.5">
          <span className="text-xs font-bold uppercase tracking-[0.06em] text-[var(--muted)]">
            {field.label}
          </span>
          <select
            name={field.name}
            defaultValue={field.value ?? ""}
            className="focus-ring min-h-11 rounded-md border border-[var(--line)] bg-white px-3 text-sm font-semibold"
          >
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      ))}
      <button
        type="submit"
        className="focus-ring mt-auto flex min-h-11 items-center justify-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-bold text-white transition hover:bg-[var(--primary-dark)]"
      >
        <Filter size={17} aria-hidden="true" />
        Aplicar filtros
      </button>
    </form>
  );
}
