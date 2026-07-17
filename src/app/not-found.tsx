import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Page Not Found - Inch is CM",
  description: "The requested Inch is CM page could not be found.",
  robots: { index: false, follow: true },
  alternates: {},
};

export default function NotFound() {
  return (
    <article className="narrow content-page not-found-page">
      <div className="eyebrow">404 error</div>
      <h1>Page not found</h1>
      <p className="lead">
        The address may be incorrect, or the conversion page may not be part of the site&apos;s approved page set.
      </p>
      <div className="card">
        <h2>Continue converting</h2>
        <p>Use a converter or browse the site map to find a supported length or size conversion.</p>
        <ul className="link-list">
          <li><Link href="/">Inch to CM Converter</Link></li>
          <li><Link href="/cm-to-inches">CM to Inches</Link></li>
          <li><Link href="/height-converter">Height Converter</Link></li>
          <li><Link href="/site-map">Site Map</Link></li>
        </ul>
      </div>
    </article>
  );
}
