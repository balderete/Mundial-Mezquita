import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="panel mx-auto max-w-xl p-10 text-center">
      <SearchX
        size={42}
        className="mx-auto text-[var(--primary)]"
        aria-hidden="true"
      />
      <h1 className="mt-4 text-2xl font-black">No encontramos esa página</h1>
      <p className="mt-2 text-[var(--muted)]">
        El participante o la sección solicitada no existe.
      </p>
      <Link
        href="/"
        className="focus-ring mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-[var(--primary)] px-4 text-sm font-bold text-white"
      >
        <ArrowLeft size={17} aria-hidden="true" />
        Volver al ranking
      </Link>
    </div>
  );
}
