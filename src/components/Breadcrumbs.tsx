import Link from "next/link";

export function Breadcrumbs({ current, wide = false }: { current: string; wide?: boolean }) {
  return (
    <nav className={`${wide ? "shell" : "narrow"} breadcrumbs`} aria-label="Breadcrumb">
      <Link href="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">{current}</span>
    </nav>
  );
}
