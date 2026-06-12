import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, CalendarDays, Trophy } from "lucide-react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "La Mezquita Mundialista",
    template: "%s | La Mezquita Mundialista",
  },
  description: "Ranking y estadísticas del torneo de pronósticos del Mundial 2026.",
};

const navigation = [
  { href: "/", label: "Ranking", icon: Trophy },
  { href: "/partidos", label: "Partidos", icon: CalendarDays },
  { href: "/estadisticas", label: "Estadísticas", icon: BarChart3 },
] as const;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>
        <header className="border-b border-[var(--line)] bg-white/95 backdrop-blur">
          <div className="page-shell flex min-h-18 flex-col justify-center gap-3 py-3 sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm">
              <span className="grid size-10 place-items-center rounded-md bg-[var(--primary)] text-white">
                <Trophy size={20} aria-hidden="true" />
              </span>
              <span>
                <span className="block text-[0.7rem] font-bold uppercase tracking-[0.08em] text-[var(--muted)]">
                  Mundial 2026
                </span>
                <span className="block text-base font-black">
                  La Mezquita Mundialista
                </span>
              </span>
            </Link>
            <nav aria-label="Navegación principal" className="flex gap-1">
              {navigation.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className="focus-ring flex min-h-10 flex-1 items-center justify-center gap-2 rounded-md px-3 text-sm font-bold text-[var(--muted)] transition hover:bg-[var(--surface-muted)] hover:text-[var(--foreground)] sm:flex-none"
                >
                  <Icon size={17} aria-hidden="true" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="page-shell py-8 sm:py-12">{children}</main>
        <footer className="mt-10 border-t border-[var(--line)] bg-white">
          <div className="page-shell flex flex-col gap-1 py-6 text-sm text-[var(--muted)] sm:flex-row sm:justify-between">
            <p>La Mezquita Mundialista · Mundial 2026</p>
            <p>Datos actualizados desde Google Sheets</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
