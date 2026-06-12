import type { ReactNode } from "react";

interface PageHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
}

export function PageHeading({
  eyebrow,
  title,
  description,
  action,
}: PageHeadingProps) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <p className="eyebrow mb-2">{eyebrow}</p>
        <h1 className="text-3xl font-black sm:text-4xl">{title}</h1>
        <p className="mt-3 leading-7 text-[var(--muted)]">{description}</p>
      </div>
      {action}
    </div>
  );
}
