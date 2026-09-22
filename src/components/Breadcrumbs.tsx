import Link from "next/link";

export function Breadcrumbs({ current, wide = false, compact = false }: { current: string; wide?: boolean; compact?: boolean }) {
  return (
    <nav className={`${wide ? "shell" : "narrow"} breadcrumbs${compact ? " breadcrumbs-compact" : ""}`} aria-label="Breadcrumb">
      <Link href="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">{current}</span>
    </nav>
  );
}
