import Link from "next/link";

export function Breadcrumbs({ current }: { current: string }) {
  return (
    <div className="shell breadcrumbs" aria-label="Breadcrumb">
      <Link href="/">Home</Link> <span aria-hidden="true">/</span> <span>{current}</span>
    </div>
  );
}
